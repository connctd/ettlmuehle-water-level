package main

import (
	"fmt"
	"net/http"

	handler "sthh.eu/graphql/api"
)

// this application is just for local testing
func main() {
	http.HandleFunc("/api/currentValues", handler.HandleCurrentValuesCall)
	http.HandleFunc("/api/aggregate/week", handler.HandleAggregateWeekCall)
	http.HandleFunc("/api/aggregate/month", handler.HandleAggregateMonthCall)
	http.HandleFunc("/api/aggregate/quarterly", handler.HandleQuarterlyHourCall)
	http.HandleFunc("/api/aggregate", handler.HandleAggregateCall)

	fmt.Println("Waiting...")
	http.ListenAndServe(":8080", nil)

}
