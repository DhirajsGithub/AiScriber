import openai
# from apiKey import APIKEY
openai.api_key = "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"

def getSummary(subtitles):
    output = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[{"role": "user", "content":
               subtitles + "\nconvert above text to short summary"}]
    )
    return output.choices[0].message.content
