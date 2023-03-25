# import library
import speech_recognition as sr
# Initiаlize  reсоgnizer  сlаss  (fоr  reсоgnizing  the  sрeeсh)
r = sr.Recognizer()
# Reading Audio file as source
#  listening  the  аudiо  file  аnd  stоre  in  аudiо_text  vаriаble


def textFile(text):
    with open(r"subtitles.txt", "w") as wf:
        wf.write(text)


def getText():
    with sr.AudioFile('../server-node/client/uploads/audio.wav') as source:
        audio_text = r.listen(source)
    # recoginize_() method will throw a request error if the API is unreachable, hence using exception handling
        try:
            # using google speech recognition
            text = r.recognize_google(audio_text)
            print('Converting audio transcripts into text ...')
            textFile(text)
            return text
        except:
            return "Nothing"
            print('Sorry.. run again...')
