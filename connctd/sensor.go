package connctd

type SensorId string

type HistoryBySensorId map[SensorId][]DataPoint

type LevelBySensorId map[SensorId]int

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
