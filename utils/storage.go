package utils

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"

	log "github.com/sirupsen/logrus"

	md "crypto/md5"
	"io/ioutil"
	"net/http"
	"strconv"
	"time"
)

var (
	tmpAccessTokenDir = "/tmp"
	retries           = 5
)

type ConnctdToken struct {
	AccessToken string    `json:"access_token"`
	Retrieved   time.Time `json:"retrieved"`
}

func (t *ConnctdToken) expired() bool {
	expirationDate := t.Retrieved.Add(time.Minute * 30)
	return time.Now().After(expirationDate)
}

// TokenStore allows sending requests against connctd
type TokenStore interface {
	// GetToken retrieves a cached or new token
	GetToken() (ConnctdToken, error)
}

// Store implements token store
type Store struct {
	clientID     string
	clientSecret string
	token        ConnctdToken
	httpClient   *http.Client
	baseURL      string
}

// GetTokenStore creates new token store
func GetTokenStore() (TokenStore, error) {
	baseURL := os.Getenv(EnvBaseURL)
	if baseURL == "" {
		return &Store{}, errors.New("base url env var not set")
	}

	clientID := os.Getenv(EnvClientID)
	if clientID == "" {
		return &Store{}, errors.New("client id env var not set")
	}

	clientSecret := os.Getenv(EnvClientSecret)
	if clientSecret == "" {
		return &Store{}, errors.New("client secret env var not set")
	}

	return &Store{baseURL: baseURL, clientID: clientID, clientSecret: clientSecret, httpClient: &http.Client{}}, nil
}

// GetToken implements interface defintion
func (c *Store) GetToken() (ConnctdToken, error) {

	if err := c.updateToken(); err != nil {
		return ConnctdToken{}, err
	}

	return c.token, nil
}

func (c *Store) updateToken() error {
	// try to fetch already retrieved token from previous calls
	token, err := c.restoreTokenFromFile()

	// we need a new token
	if err != nil || token.expired() {
		for i := 0; i < retries; i++ {
			token, err = c.retrieveToken()

			if err == nil {
				break
			}

			if err != nil && i >= retries-1 {
				return err
			}
		}

		// cache token
		if err := c.cacheToken(token); err != nil {
			log.WithError(err).Errorln("Failed to cache token")
		}
	}

	c.token = token

	return nil
}

func (c *Store) doRequest(ctx context.Context, method string, baseURL string, endpoint string, expectedStatusCode int, payload interface{}, plainString string, response interface{}, includedHeaders *map[string]string) error {
	var req *http.Request
	var err error

	if payload != nil {
		payloadBytes, perr := json.Marshal(payload)

		if perr != nil {
			return perr
		}

		req, err = http.NewRequest(method, baseURL+endpoint, bytes.NewBuffer(payloadBytes))
	} else if plainString != "" {
		req, err = http.NewRequest(method, baseURL+endpoint, bytes.NewBuffer([]byte(plainString)))
	} else {
		req, err = http.NewRequest(method, baseURL+endpoint, nil)
	}

	// propagate context so that premature cancelation can be done or timeouts realized
	req = req.WithContext(ctx)

	if err != nil {
		return err
	}

	if payload != nil {
		defer req.Body.Close()
	}

	// add headers
	if includedHeaders != nil {
		for key, value := range *includedHeaders {
			req.Header.Add(key, value)
		}
	}

	resp, err := c.httpClient.Do(req)

	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode != expectedStatusCode {
		return errors.New("Invalid status code: " + strconv.Itoa(resp.StatusCode))
	}

	if response != nil {
		err = json.NewDecoder(resp.Body).Decode(response)

		if err != nil {
			return err
		}
	}

	return nil
}

// does a request against auth service in order to retrieve a new token
func (c *Store) retrieveToken() (ConnctdToken, error) {
	header := make(map[string]string)

	data := c.clientID + ":" + c.clientSecret
	auth := base64.StdEncoding.EncodeToString([]byte(data))

	header["Authorization"] = "Basic " + auth
	header["Content-Type"] = "application/x-www-form-urlencoded"

	body := "grant_type=client_credentials&scope=connctd.things.read+connctd.units.read+connctd.things.action+connctd.units.admin"

	var token ConnctdToken
	if err := c.doRequest(context.Background(), http.MethodPost, c.baseURL, "/oauth2/token", http.StatusOK, nil, body, &token, &header); err != nil {
		return ConnctdToken{}, err
	}

	token.Retrieved = time.Now()
	return token, nil
}

func (c *Store) restoreTokenFromFile() (ConnctdToken, error) {
	tokenBytes, err := ioutil.ReadFile(tmpAccessTokenDir + "/" + md5(c.clientID+":"+c.clientSecret))
	if err != nil {
		log.WithError(err).Warningln("Failed to retrieve tmp token")
		return ConnctdToken{}, err
	}

	var res ConnctdToken
	err = json.Unmarshal(tokenBytes, &res)
	if err != nil {
		return ConnctdToken{}, err
	}

	return res, nil
}

func (c *Store) cacheToken(token ConnctdToken) error {
	tokenBytes, err := json.Marshal(token)

	if err != nil {
		return err
	}

	err = ioutil.WriteFile(tmpAccessTokenDir+"/"+md5(c.clientID+":"+c.clientSecret), tokenBytes, 0644)
	if err != nil {
		return err
	}

	return nil
}

func md5(text string) string {
	hasher := md.New()
	hasher.Write([]byte(text))
	return hex.EncodeToString(hasher.Sum(nil))
}
