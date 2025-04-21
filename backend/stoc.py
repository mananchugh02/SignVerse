import speech_recognition as sr
import pyttsx3 


def SpeakText(command):
    engine = pyttsx3.init()
    engine.say(command) 
    engine.runAndWait()

# def main():   
#     r = sr.Recognizer() 
#     try:
#         with sr.Microphone() as source2:
#             r.adjust_for_ambient_noise(source2, duration=0.2)

#             audio2 = r.listen(source2)

#             MyText = r.recognize_google(audio2)
#             MyText = MyText.lower()

#             print("Did you say ",MyText)
#             SpeakText(MyText)
#             return MyText
            
#     except sr.RequestError as e:
#         print("Could not request results; {0}".format(e))
        
#     except sr.UnknownValueError:
#         print("unknown error occurred&quot")

def main():   
    r = sr.Recognizer() 
    try:
        with sr.Microphone() as source2:
            r.adjust_for_ambient_noise(source2, duration=0.2)
            print("Listening...")
            audio2 = r.listen(source2)

            MyText = r.recognize_google(audio2)
            MyText = MyText.lower()

            print("You said:", MyText)
            SpeakText(MyText)
            return MyText
            
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))
        return None
        
    except sr.UnknownValueError:
        print("Unknown error occurred")
        return None



# main()


# import speech_recognition as sr
# import pyttsx3 


# def SpeakText(command):
#     engine = pyttsx3.init()
#     engine.say(command) 
#     engine.runAndWait()

# def main():   
#     r = sr.Recognizer() 
#     try:
#         with sr.Microphone() as source2:
#             r.adjust_for_ambient_noise(source2, duration=0.2)

#             audio2 = r.listen(source2)

#             MyText = r.recognize_google(audio2)
#             MyText = MyText.lower()

#             print("Did you say ",MyText)
#             SpeakText(MyText)
#             return MyText
            
#     except sr.RequestError as e:
#         print("Could not request results; {0}".format(e))
        
#     except sr.UnknownValueError:
#         print("unknown error occurred&quot")


# # main()