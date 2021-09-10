package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"sthh.eu/graphql/connctd"
)

const DEFAULT_NUMBER_OF_MONTHS = 1

func HandleAggregateMonthCall(w http.ResponseWriter, r *http.Request) {
	handleCors(w, r)

	switch r.Method {
	case http.MethodOptions:
	case http.MethodGet:
		handleMonthData(w, r)
	default:
		handleNotFound(w)
	}
}

func handleMonthData(w http.ResponseWriter, r *http.Request) {
	toQuery := r.URL.Query().Get("to")
	nQuery := r.URL.Query().Get("n")

	resp := AggregatedDataResponse{
		Errors: make([]string, 0),
	}

	n, err := strconv.Atoi(nQuery)
	if err != nil && nQuery != "" {
		resp.Errors = append(resp.Errors, "Failed to parse request. n should be a integer")
	}
	if nQuery == "" {
		n = DEFAULT_NUMBER_OF_MONTHS
	}

	to, err := toTime(toQuery)
	if err != nil {
		resp.Errors = append(resp.Errors, "Failed to parse request. from should be in RFC 3338 format")
	}

	if len(resp.Errors) > 0 {
		respJson, _ := json.Marshal(resp)
		w.WriteHeader(http.StatusBadRequest)
		w.Write(respJson)
		return
	}

	aggregatedData, err := connctd.MonthlyData(to, n)
	if err != nil {
		resp.Errors = append(resp.Errors, err.Error())
		w.WriteHeader(http.StatusInternalServerError)
	}
	resp.Data = aggregatedData
	w.Header().Add("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
