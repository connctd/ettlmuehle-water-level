package connctd

type SensorId string

type HistoryBySensorId map[SensorId][]DataPoint

type LevelBySensorId map[SensorId]int

/**
{
    "data": {
        "things": [
            {
                "id": "971b30bc-de96-4298-8a0b-b8c5456b9ebf",
                "name": "LDDS75",
                "mainComponentId": "waterlevel",
                "displayType": "SENSOR",
                "manufacturer": "Dragino",
                "status": "AVAILABLE",
                "components": [
                    {
                        "id": "battery",
                        "name": "Battery",
                        "capabilities": [
                            "core.MEASURE"
                        ],
                        "componentType": "core.BATTERY",
                        "properties": [
                            {
                                "id": "chemistry",
                                "name": "Battery chemistry",
                                "lastUpdate": "2021-09-08T08:09:04Z",
                                "unit": "",
                                "propertyType": "core.STRING",
                                "value": "Li-SoCl2"
                            },
                            {
                                "id": "voltage",
                                "name": "Voltage",
                                "lastUpdate": "2021-09-08T08:09:04Z",
                                "unit": "VOLT",
                                "propertyType": "core.VOLTAGE",
                                "value": ""
                            }
                        ],
                        "actions": []
                    },
                    {
                        "id": "waterlevel",
                        "name": "Messstelle",
                        "capabilities": [
                            "core.MEASURE"
                        ],
                        "componentType": "core.SENSOR",
                        "properties": [
                            {
                                "id": "waterlevel",
                                "name": "Waterlevel",
                                "lastUpdate": "2021-09-09T07:45:10Z",
                                "unit": "CENTIMETER",
                                "propertyType": "core.WATERLEVEL",
                                "value": "434"
                            }
                        ],
                        "actions": []
                    }
                ]
            },
**/
type SensorData struct {
	Data struct {
		Things []struct {
			ID          SensorId `json:"id"`
			Name        string   `json:"name"`
			Status      string   `json:"status"`
			DisplayType string   `json:"displayType"`
			Components  []Component
		}
	}
}

func (r *SensorData) currentValues() LevelBySensorId {
	res := LevelBySensorId{}
	for _, thing := range r.Data.Things {
		for _, component := range thing.Components {
			for _, prop := range component.Properties {
				res[thing.ID] = prop.Value
			}
		}
	}
	return res
}

func (r *SensorData) waterLevelSensorById() map[SensorId]Component {
	res := make(map[SensorId]Component, 0)
	for _, thing := range r.Data.Things {
		for _, component := range thing.Components {
			if component.ID != waterLevelComponentId {
				continue
			}
			res[thing.ID] = component
		}
	}
	return res
}

type Component struct {
	ID            string `json:"id"`
	Name          string `json:"name"`
	ComponentType string `json:componentType`
	Properties    []Property
}

type Property struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	Value        int    `json:"value,string"`
	Unit         string `json:"unit"`
	PropertyType string `json:propertyType`
	History      struct {
		Edges []struct {
			Node struct {
				Value     int    `json:"value"`
				Timestamp string `json:"timestamp"`
			}
		}
	}
}
