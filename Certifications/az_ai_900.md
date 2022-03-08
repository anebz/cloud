# [Azure AI fundamentals](https://docs.microsoft.com/en-us/learn/certifications/azure-ai-fundamentals/)

[ExamTopics sample questions](https://www.examtopics.com/exams/microsoft/ai-900/view/)

## [Microsoft guiding principles for responsible AI](https://docs.microsoft.com/en-us/learn/modules/responsible-ai-principles/4-guiding-principles)

* Accountability
    - Ensure that decisions made by AI can be overriden by humans
* Transparency
    - Model explain ability: with model explain ability, we enable you to understand feature importance as part of automated ML runs.
* Fairness
    - Avoid treating similarly situated groups of people differently, help mitigate bias
* Inclusiveness
    - Make AI accessible to people with disabilities
* Privacy and security
    - Provide consumers with info and control over the collection, use and storage of their data
* Reliability and safety
    - Ensure that AI systems operate as they were originally designed, respond to unanticipated conditions and resist harmful manipulation

## Images

## Computer vision

It can detect faces in an image, recognize handwritten text. It can't train a custom model.

### [Face feature](https://docs.microsoft.com/en-us/azure/cognitive-services/face/overview)

* Face detection: detects human faces in an image and returns the rectangle coordinates. Optionally, face detection can extract a series of face-related attributes, such as head pose, gender, age, emotion, facial hair, and glasses
* Face verification: check if two images are the same person
* Face identification: one-to-many matching. given an image, find a matching image from a database
* Find similar faces: matching between a target face and a set of candidate faces
* Face grouping: divides a set of unknown faces into several groups based on similarity

MAE, RMSE and R2 are metris for regression. confusion matrix is for classification

## Text

### [Form recognizer](https://azure.microsoft.com/en-us/services/form-recognizer/)

Extract text, key/value pairs, and tables from documents, both on-premises and in the cloud.

### [Text analytics](https://docs.microsoft.com/en-gb/azure/cognitive-services/text-analytics/overview)

Key phrase extraction, name entity recognition, language identification.

### [Speech](https://azure.microsoft.com/en-gb/services/cognitive-services/speech-services/)

It can convert speech to text, text to speech and translate speech, verify and recognize speakers, activate an IoT device with a custom keyword, add voice commands for hands-free scenarios

### Bot

A bot needs a knowledge base (QnA Maker) and a Bot service. QnA Maker creates a conversational question-and-answer layer over your existing data. Use it to build a knowledge base by extracting questions and answers from your semi-structured content, including FAQs, manuals, and documents. In QnA Maker, you can

* Generate Q&As from an existing webpage
* Manually enter Q&As
* Import chit-chat content from a predefined data source

## AML 

The Designer feature lets you visually connect datasets and modules on an interactive canvas to create machine learning models. You can save a pipeline draft with the progress up until a point. Automated ML includes Designer

To perform real-time inferencing, you must deploy a pipeline as a real-time endpoint. Real-time endpoints must be deployed to an Azure Kubernetes Service cluster. For not real-time, a container instance is enough.
