# [Azure AI Engineer](hhttps://docs.microsoft.com/en-us/learn/certifications/azure-ai-engineer/)

Responsible AI:

* Fairness
* Reliability and safety
* Privacy and security
* Inclusiveness
* Transparency
* Accountability

## Azure cognitive services

* Single-service resource: individual resource. Different endpoint for each service, separate billing. Offers free tier
* Multi-service resource: language, computer vision, speech, etc

To consume the endpoint, we need:

* Endpoint URI
* Subscription key
* Resource location

```python
# pip install azure-ai-textanalytics==5.0.0
credential = AzureKeyCredential(cog_key)
client = TextAnalyticsClient(endpoint=cog_endpoint, credential=credential)
```

Keys can also be stored in a keyvault. To do this, a Service Principal has to be created and given access to the keyvault.

### Monitoring

* Azure pricing calculator (needs specific cognitive service API, region and pricing tier)
* View costs in Costs analysis
* Alerts: specify scope(resource), condition: signal type (e.g. Activity Log) or metric (e.g. \#errors exceeding 10 in an hour)

To create diagnostics:

* Create resource for diagnostic log storage: azure log analytics, or azure storage
* configure diagnostic settings
	- Name
	- Categories of log event data
	- Details of the destinations in which you want to store the log data
	
it can take 1h or more for diagnostic data to start flowing to the destination. There, it can be viewed by running qeries

Cognitive services can be deployed on-premises or in Azure. Deploying Cognitive Services in a container on-premises will also decrease the latency between the service and your local data, which can improve performance.

Containers can be deployed to the following options:

* A docker server
* An Azure Container Instance (ACI)
* An AKS cluster

To deploy and use a CS (cognitive services) containers:

1. The container image is downloaded and deployed to a container host (Docker server, ACI or AKS cluster)
2. Client apps submit data to the endpoint and retrieve results
3. Periodically, usage metrics for the containerized service are sent to the CS resource in Azure to calculate billing

Even when using a container, the CS resource must be provisioned in Azure for billing purposes. Client applications send their requests to the containerized service, meaning that potentially sensitive data is not sent to the Cognitive Services endpoint in Azure; but the container must be able to connect to the Cognitive Services resource in Azure periodically to send usage metrics for billing.

To deploy to container, must specify 3 settings: ApiKey, Billing, Eula (value of accept to state you accept the license of the container). No subscription key necessary

### Language

#### Language detection

Input request. Max 5120 characters in text, max 1000 documents. Optionally, you can provide a countryHint to improve prediction performance.

In the code:

```python
sentimentAnalysis = cog_client.detect_language(documents=[text])[0]
```

```json
{
  "documents": [
    {
      "countryHint": "US",
      "id": "1",
      "text": "Hello world"
    }
  ]
}
```

Response json:

```json
{
  "documents": [
   {
     "id": "1",
     "detectedLanguage": {
       "name": "English",
       "iso6391Name": "en",
       "confidenceScore": 1
     },
     "warnings": []
   }
  ],
  "errors": [],
  "modelVersion": "2020-04-01"
}
```

If there are encoding problems, or text isn't string, the result will be (Unknown) and score: NaN

#### Key-phrase extraction

In the code:

```python
phrases = cog_client.extract_key_phrases(documents=[text])[0].key_phrases
for phrase in phrases:
    print('\t{}'.format(phrase))
```

Input JSON same as with language detection. Response:

```json
{
  "documents": [
   {
     "id": "1",
     "keyPhrases": [
       "change",
       "world"
     ],
     "warnings": []
   }
  ],
  "errors": [],
  "modelVersion": "2020-04-01"
}
```

#### Sentiment analysis

In the code:

```python
sentimentAnalysis = cog_client.analyze_sentiment(documents=[text])[0]
```

Input:

```json
{
  "documents": [
    {
      "language": "en",
      "id": "1",
      "text": "Smile! Life is good!"
    }
  ]
}
```

Output:

```json
{
  "documents": [
   {
     "id": "1",
     "sentiment": "positive",
     "confidenceScores": {
       "positive": 0.99,
       "neutral": 0.01,
       "negative": 0.00
     },
     "sentences": [
       {
         "text": "Smile!",
         "sentiment": "positive",
         "confidenceScores": {   
             "positive": 0.97,
	         "neutral": 0.02, 
             "negative": 0.01
           },
         "offset": 0,
         "length": 6
       },
       {
	      "text": "Life is good!",
          "sentiment": "positive",
          "confidenceScores": {   
             "positive": 0.98,
	         "neutral": 0.02,  
             "negative": 0.00
           },
         "offset": 7,
         "length": 13
       }
     ],
     "warnings": []
   }
  ],
  "errors": [],
  "modelVersion": "2020-04-01"
}
```

* If sentences are neutral, overall sentiment is neutral
* If sentences are positive + neutral -> positive
* If sentences are negative + neutral -> negative
* If sentences are positive + negative -> mixed

#### Named entity recognition

In the code:

```python
entities = cog_client.recognize_entities(documents=[text])[0].entities
for entity in entities:
    print(f"{entity.text}: {entity.category}")
```

Same input as sentiment analysis. Output:

```json
{
  "documents":[
      {
          "id":"1",
          "entities":[
          {
            "text":"Joe",
            "category":"Person",
            "offset":0,
            "length":3,
            "confidenceScore":0.62
          },
          {
            "text":"London",
            "category":"Location",
            "subcategory":"GPE",
            "offset":12,
            "length":6,
            "confidenceScore":0.88
          },
          {
            "text":"Saturday",
            "category":"DateTime",
            "subcategory":"Date",
            "offset":22,
            "length":8,
            "confidenceScore":0.8
          }
        ],
        "warnings":[]
      }
  ],
  "errors":[],
  "modelVersion":"2021-01-15"
}
```

* Domain: email, communication
* Utterance: turn on the light
* Entity: Paris, Lamp

Entity types:

* Machine learned entities are the most flexible kind of entity, and should be used in most cases. You define a machine learned entity with a suitable name, and then associate words or phrases with it in training utterances. When you train your model, it learns to match the appropriate elements in the utterances with the entity
* List entities are useful when you need an entity with a specific set of possible values - for example, days of the week. You can include synonyms in a list entity definition, so you could define a DayOfWeek entity that includes the values "Sunday", "Monday", "Tuesday", and so on; each with synonyms like "Sun", "Mon", "Tue", and so on
* Regular Expression or RegEx entities are useful when an entity can be identified by matching a particular format of string. For example, a date in the format MM/DD/YYYY, or a flight number in the format AB-1234
* Pattern.any() entities are used with patterns, which are discussed in the next topic

#### Entity linking

In the code:

```python
entities = cog_client.recognize_linked_entities(documents=[text])[0].entities
for linked_entity in entities:
    print(f"{linked_entity.name}: {linked_entity.url}")
```

Identifying specific entities by providing reference links to Wikipedia articles. Output: 

```json
{
  "documents":
    [
      {
        "id":"1",
        "entities":[
          {
            "name":"Venus",
            "matches":[
              {
                "text":"Venus",
                "offset":6,
                "length":5,
                "confidenceScore":0.01
              }
            ],
            "language":"en",
            "id":"Venus",
            "url":"https://en.wikipedia.org/wiki/Venus",
            "dataSource":"Wikipedia"
          }
        ],
        "warnings":[]
      }
    ],
  "errors":[],
  "modelVersion":"2020-02-01"
}
```

#### Translation

To access the API, we need the subscription key and the location.

This API supports language detection and translation (as input we need the original test and the "to" language). Also supports transliteration (changing script)

When translating to languages without tokenization, the JSON response includes an alignment projection: "0:8-0:1 ..." saying that chars 0-8 in the original language correspond to chars 0-1 in the target language.

The response also includes sentLen, sentence length of the original text and the translated text.

Profanity filtering:

* NoAction
* Deleted
* Marked: replaced by **** or any other technique.

A custom model can be trained with custom translations. Your custom model is assigned a unique category Id, which you can specify in translate calls to your Translator resource by using the category parameter, causing translation to be performed by your custom model instead of the default model.

```python
# Use the Translator detect function
path = '/detect'
url = translator_endpoint + path

# Build the request
params = {
    'api-version': '3.0'
}

headers = {
'Ocp-Apim-Subscription-Key': cog_key,
'Ocp-Apim-Subscription-Region': cog_region,
'Content-type': 'application/json'
}

body = [{
    'text': text
}]

# Send the request and get response
request = requests.post(url, params=params, headers=headers, json=body)
response = request.json()

# Parse JSON array and get language
language = response[0]["language"]


# Use the Translator translate function
path = '/translate'
url = translator_endpoint + path

# Build the request
params = {
    'api-version': '3.0',
    'from': source_language,
    'to': ['en']
}

headers = {
    'Ocp-Apim-Subscription-Key': cog_key,
    'Ocp-Apim-Subscription-Region': cog_region,
    'Content-type': 'application/json'
}

body = [{
    'text': text
}]

# Send the request and get response
request = requests.post(url, params=params, headers=headers, json=body)
response = request.json()

# Parse JSON array and get translation
translation = response[0]["translations"][0]["text"]
```

#### Language understanding

Using LUIS app (luis.ai). To access endpoint, we need App ID, endpoint URL and primary key/secondary key. Model can be exported to a .lu file and imported into another Language understanding app

To deploy: staging, production. When deploying you can activate sentiment analysis, spelling correction, speech priming (if it'll be used with speech)

When calling the endpoint, we need:

* query
* show-all-intents: include all identified intents and their scores, or only the most likely intent
* verbose: bool
* log: to use active learning

Language Understanding just returns the intent, not the actual time.

to use LU app in a container:

1. Download the container image
2. Export the model for a container (.gz)
3. Run the container with required parameters
  - Prediction endpoint for billing
  - Prediction key
  - EULA acceptance
  - Mount points (input for exported models, output for logs)
4. Use container to predict intents
5. The conatiner sends usage metrics to the prediction resource for billing

Perform intent recognition with the Speech SDK

![ ](https://docs.microsoft.com/en-gb/learn/wwl-data-ai/use-language-understanding-speech/media/speech-sdk.png)

* Speech config: info to connect to LU, not to the Speech resource. Location and key of the LU resource
* AudioConfig: input source for the speech

If the operation was successful, the Reason property has the enumerated value **RecognizedIntent**, and the IntentId property contains the top intent name. Full details of the Language Understanding prediction can be found in the Properties property, which includes the full JSON prediction.

Other possible values for Result include **RecognizedSpeech**, which indicates that the speech was successfully transcribed (the transcription is in the Text property), but no matching intent was identified. If the result is **NoMatch**, the audio was successfully parsed but no speech was recognized, and if the result is **Canceled**, an error occurred (in which case, you can check the Properties collection for the CancellationReason property to determine what went wrong.)

---

Other tasks:

* Text analysis
* Question answering

### Speech

Needs subscription key and location to access the API.

#### Speech to text

* The Speech-to-text API, which is the primary way to perform speech recognition. The endpoint for this API is `https://<LOCATION>.api.cognitive.microsoft.com/sts/v1.0`
* The Speech-to-text Short Audio API, which is optimized for short streams of audio (up to 60 seconds). The endpoint for this API is at `https://<LOCATION>.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`

![ ](https://docs.microsoft.com/en-us/learn/wwl-data-ai/transcribe-speech-input-text/media/speech-to-text.png)

1. Use a SpeechConfig object to encapsulate the information required to connect to your Speech resource. Specifically, its location and key.
2. Optionally, use an AudioConfig to define the input source for the audio to be transcribed. By default, this is the default system microphone, but you can also specify an audio file.
3. Use the SpeechConfig and AudioConfig to create a SpeechRecognizer object. This object is a proxy client for the Speech-to-text API.
4. Use the methods of the SpeechRecognizer object to call the underlying API functions. For example, the RecognizeOnceAsync() method uses the Speech service to asynchronously transcribe a single spoken utterance.
5. Process the response from the Speech service. In the case of the RecognizeOnceAsync() method, the result is a SpeechRecognitionResult object that includes the following properties:
  * Duration
  * OffsetInTicks
  * Properties
  * Reason
  * ResultId
  * Text

#### Text to speech

* The Text-to-speech API, which is the primary way to perform speech synthesis. The endpoint for this API is `https://<LOCATION>.api.cognitive.microsoft.com/sts/v1.0`
* The Text-to-speech Long Audio API, which is designed to support batch operations that convert large volumes of text to audio - for example to generate an audio-book from the source text. The endpoint for this API is at `https://<LOCATION>.customvoice.api.speech.microsoft.com/api/texttospeech/v3.0/longaudiosynthesis`

![ ](https://docs.microsoft.com/en-us/learn/wwl-data-ai/transcribe-speech-input-text/media/text-to-speech.png)

Audio format: you can pick the audio file type, the sample rate and the bit depth. The supported formats are indicated in the SDK using the *SpeechSynthesisOutputFormat* enumeration. To specify a output format:

```python
speechConfig.SetSpeechSynthesisOutputFormat(SpeechSynthesisOutputFormat.Riff24Khz16BitMonoPcm);
```

For voices, you can pick standard voices (synthetic) or neural (natural, created from DNNs). To specify a voice:

```python
speechConfig.SpeechSynthesisVoiceName = "en-GB-George";
```

You can also use the *Speech Synthesis Markup Language (SSML)*. this includes:

* Specify a speaking style (excited, cheerful) when using a neural voice
* Insert pauses or silence
* Specify phonemes (pronouncing SQL as sequel)
* Adjust the prosody of the voice (affecting the pitch, timbre, and speaking rate).
* Use common "say-as" rules, for example to specify that a given string should be expressed as a date, time, telephone number, or other form.
* Insert recorded speech or audio, for example to include a standard recorded message or simulate background noise.

```text
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" 
                     xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="en-US"> 
    <voice name="en-US-AriaNeural"> 
        <mstts:express-as style="cheerful"> 
          I say tomato 
        </mstts:express-as> 
    </voice> 
    <voice name="en-US-GuyNeural"> 
        I say <phoneme alphabet="sapi" ph="t ao m ae t ow"> tomato </phoneme>. 
        <break strength="weak"/>Lets call the whole thing off! 
    </voice> 
</speak>

# to submit SSML description to the Speech device:
speechSynthesizer.SpeakSsmlAsync(ssml_string);
```

#### Speech translation

TranslationRecognizer does speech to text

![ ](https://docs.microsoft.com/en-gb/learn/wwl-data-ai/translate-speech-speech-service/media/translate-speech.png)

To do speech-to-speech directly:

* Event-based synthesis
  * when translating to only 1 target language
  1. Specify the desired voice for the translated speech in the TranslationConfig.
  2. Create an event handler for the TranslationRecognizer object's Synthesizing event.
  3. In the event handler, use the GetAudio() method of the Result parameter to retrieve the byte stream of translated audio.
* Manual synthesis
  * doesn't require to implement an event handler
  * Supports 1+ target languages
  * Manual synthesis of translations is essentially just the combination of two separate operations in which you:
    * Use a TranslationRecognizer to translate spoken input into text transcriptions in one or more target languages
    * Iterate through the Translations dictionary in the result of the translation operation, using a SpeechSynthesizer to synthesize an audio stream for each language

---

* Speaker recognition

### Vision

* Image analysis
* Video analysis
* Image classification
* Object detection
* Facial analysis
* Optical character recognition

### Decision

* Anomaly detection
* Content moderation
* Content personalization

## Applied AI services

* Form recognizer: OCR to extract semantic meaning from forms
* Metrics advisor: built on the anomaly detector cognitive service that simplifies real-time monitoring and response to critical metrics
* Video analyzer for media: video analysts solution build on the Video Indexer cognitive service
* Immersive reader
* Bot service
	- Bot framework SDK: write code
	- Bot framework composer: develop complex bots using a UI
* Cognitive search
	- Enrichment pipeline: enhance the index with insights derived from source data (using NLP and CV to generate descriptions of images)
	- Enrichment pipeline can be persisted in a knowledge store for further analysis