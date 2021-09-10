package connctd

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"os"
	"path"
	"time"

	"github.com/jinzhu/now"
	"github.com/sirupsen/logrus"
	"sthh.eu/graphql/utils"
)

const externalSubjectID = "default"
const waterLevelComponentId = "waterlevel"

const thingsQuery = `
	query {
		things {
			id
			name
			status
			displayType
			components(componentPropertyConstraint: {propertyType: "core.WATERLEVEL"}) {
				id
				name
				componentType
				capabilities
				properties {
					id
					name
					value
					unit
					propertyType
				}
			}
		}
	}
`

const thingsWithHistoryQuery = `
	query GetPropertyHistory($from: Time, $to: Time) {
		things(thingComponentConstraint: {componentType: "core.SENSOR"}) {
			id
			name
			mainComponentId
			displayType
			manufacturer
			status
			components(componentPropertyConstraint: {propertyType: "core.WATERLEVEL"}) {
				id
				name
				capabilities
				componentType
				properties {
					id
					name
					lastUpdate
					unit
					propertyType
					value
					history(from: $from, to: $to) {
						edges {
							node {
								value
								timestamp
							}
						}
					}
				}
				actions {
					id
					name
					parameters {
						name
						type
					}
				}
			}
		
		}
	}
`

func buildHistoryQuery(from, to time.Time) GQLQuery {
	variables := make(map[string]interface{})
	variables["from"] = from
	variables["to"] = to
	return GQLQuery{Query: thingsWithHistoryQuery, Variables: variables}
}

type GQLQuery struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables"`
}

type DataPoint struct {
	Date  string `json:"date"`
	Level int    `json:"level"`
}

func averageLevel(dataPoints []DataPoint) int {
	sum := 0
	if len(dataPoints) == 0 {
		return sum
	}
	for _, dataPoint := range dataPoints {
		sum += dataPoint.Level
	}
	return sum / len(dataPoints)
}

type AggregatedData struct {
	From   time.Time       `json:"from"`
	To     time.Time       `json:"to"`
	Levels LevelBySensorId `json:"levels"`
}

func MonthlyData(date time.Time, n int) ([]AggregatedData, error) {
	months := make([]AggregatedData, 0, n)
	errors := make([]error, 0)
	resultChannel := make(chan AggregatedData)
	errorChannel := make(chan error)

	// Send multiple requests to the connctd platform.
	// If this is to slow, we should instead send only one request for all months and aggregate it manually.
	for i := 0; i < n; i++ {
		go func(n int) {
			// The first day of the month
			from := time.Date(date.Year(), date.Month(), 1, 0, 0, 0, 0, date.Location())
			from = from.AddDate(0, -n, 0)
			// The last day of the month
			to := from.AddDate(0, 1, -1)
			month, err := AggregatedHistory(from, to)
			if err != nil {
				errorChannel <- err
				return
			}
			resultChannel <- month
		}(i)

	}
	for i := 0; i < n; i++ {
		select {
		case error := <-errorChannel:
			errors = append(errors, error)
		case result := <-resultChannel:
			months = append(months, result)
		}
	}
	if len(errors) > 0 {
		return months, errors[0]
	}
	return months, nil
}

func WeeklyData(date time.Time, n int) ([]AggregatedData, error) {
	results := make([]AggregatedData, 0, n)
	errors := make([]error, 0)
	resultChannel := make(chan AggregatedData)
	errorChannel := make(chan error)

	// Send multiple requests to the connctd platform.
	// If this is to slow, we should instead send only one request for all months and aggregate it manually.
	for i := 0; i < n; i++ {
		go func(n int) {
			// The first day of the month
			from := now.With(date).BeginningOfDay()
			from = from.AddDate(0, 0, -n*7)
			// The last day of the month
			to := from.AddDate(0, 0, 7)
			month, err := AggregatedHistory(from, to)
			if err != nil {
				errorChannel <- err
				return
			}
			resultChannel <- month
		}(i)

	}
	for i := 0; i < n; i++ {
		select {
		case error := <-errorChannel:
			logrus.Info(error)
			errors = append(errors, error)
		case result := <-resultChannel:
			results = append(results, result)
		}
	}
	if len(errors) > 0 {
		return results, errors[0]
	}
	return results, nil
}

func AggregatedHistory(from, to time.Time) (AggregatedData, error) {
	response := AggregatedData{From: from, To: to}
	monthlyHistory, err := history(from, to)
	if err != nil {
		return response, err
	}
	response.Levels = LevelBySensorId{}

	for sensorId, dataPoints := range monthlyHistory {
		if len(dataPoints) <= 0 {
			continue
		}
		level := averageLevel(dataPoints)
		response.Levels[sensorId] = level
	}
	return response, nil
}

func QuarterlyHourData(from, to time.Time) (map[time.Time]LevelBySensorId, error) {
	intervall := 15 * time.Minute
	h, err := history(from.Round(intervall), to.Round(intervall))
	if err != nil {
		return nil, err
	}

	// We round the sensor timestamp to the nearest 15 minute intervall
	// and map the rounded timestamp to sensor values for each sensor id.
	// If we have multiple sensor values for the same sensor that round to the same time,
	// only the last one is used. We could instead aggregate the values.
	aggregatedData := make(map[time.Time]LevelBySensorId)
	for id, dataPoints := range h {
		for _, dataPoint := range dataPoints {
			date, err := time.Parse(time.RFC3339, dataPoint.Date)
			if err != nil {
				continue
			}
			date = date.Round(intervall)
			_, ok := aggregatedData[date]
			if !ok {
				aggregatedData[date] = LevelBySensorId{}
			}
			aggregatedData[date][id] = dataPoint.Level
		}
	}
	return aggregatedData, nil
}

func history(from, to time.Time) (HistoryBySensorId, error) {
	historyData := HistoryBySensorId{}
	things, _ := getThingsWithHistory(from, to)
	sensorById := things.waterLevelSensorById()
	if len(sensorById) < 2 {
		return historyData, errors.New("Failed to retrieve at least 2 sensors from platform")
	}

	for sensorId, component := range sensorById {
		dataPoints := make([]DataPoint, 0)
		for _, property := range component.Properties {
			for _, node := range property.History.Edges {
				dataPoint := DataPoint{
					Date:  node.Node.Timestamp,
					Level: node.Node.Value,
				}
				dataPoints = append(dataPoints, dataPoint)
			}
		}
		historyData[sensorId] = dataPoints
	}
	return historyData, nil
}

func GetCurrentData() (LevelBySensorId, error) {

	things, _ := getThings()
	if len(things.Data.Things) < 2 {
		return nil, errors.New("Failed to retrieve at least 2 sensors from platform")
	}

	currentValues := things.currentValues()

	if len(currentValues) < 2 {
		return nil, errors.New("Failed to retrieve at least 2 values from sensors")
	}

	return currentValues, nil
}

func getThings() (SensorData, error) {
	var things SensorData
	err := sendGQLQuery("default", GQLQuery{Query: thingsQuery}, &things)
	return things, err
}

func getThingsWithHistory(from, to time.Time) (SensorData, error) {
	var things SensorData
	logrus.WithTime(time.Now()).Info("Start query")
	err := sendGQLQuery("default", buildHistoryQuery(from, to), &things)
	logrus.WithTime(time.Now()).Info("Finished query")
	return things, err
}

func sendGQLQuery(externalSubjectID string, query GQLQuery, respBody interface{}) error {
	store, err := utils.GetTokenStore()
	if err != nil {
		logrus.WithError(err).Errorln("Failed to fetch token store")
		return err
	}

	connctdToken, err := store.GetToken()
	if err != nil {
		logrus.WithError(err).Errorln("Failed to fetch token")
		return err
	}

	baseURL := os.Getenv(utils.EnvBaseURL)
	if baseURL == "" {
		logrus.Errorln("No base url given")
		return errors.New("No base url given")
	}

	byt, _ := json.Marshal(query)

	req, err := http.NewRequest(http.MethodPost, baseURL+path.Join("/api/v1/query"), bytes.NewBuffer(byt))
	if err != nil {
		logrus.WithError(err).Errorln("Failed to build request")
		return err
	}

	req.Header.Add("Authorization", "Bearer "+connctdToken.AccessToken)
	req.Header.Add("X-External-Subject-ID", externalSubjectID)
	req.Header.Add("Content-Type", "application/json")

	httpClient := &http.Client{}
	resp, err := httpClient.Do(req)

	if err != nil {
		logrus.WithError(err).Errorln("Failed to send request")
		return err
	}

	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(respBody)
	if err != nil {
		logrus.WithError(err).Errorln("Failed to parse response body")
		return err
	}

	return nil
}
