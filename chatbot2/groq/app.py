import streamlit as st
from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.document_loaders import WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain.chains import create_retrieval_chain
import time
import os
import pyttsx3
import threading
import requests

# --- CONFIGURATION ---
os.environ["USER_AGENT"] = "MySignLanguageBot/1.0"
GROQ_API_KEY = "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"
GIPHY_API_KEY = "Qciar2qjYFaogaLCWbybyiAexgyHCuW6"

st.set_page_config(page_title="Sign Language Web Chatbot")
st.title("Sign Language Communication Web Chatbot")

# --- PROMPT TEMPLATE ---
prompt = ChatPromptTemplate.from_template(
"""
You are an assistant specializing in Sign Language communication and translation.
Answer the question based on the provided context only, focused on Deaf, Mute, or Hard-of-Hearing individuals.
<context>
{context}
<context>
Question: {input}

Answer:
"""
)

# --- TEXT-TO-SPEECH ---
def speak_answer(answer_text):
    def run_speech():
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)
        engine.setProperty('volume', 1.0)
        engine.say(answer_text)
        engine.runAndWait()
    threading.Thread(target=run_speech).start()

def stop_speaking():
    try:
        engine = pyttsx3.init()
        engine.stop()
    except Exception as e:
        st.error(f"Error stopping speech: {e}")

# --- GIPHY FETCHING FROM ROBERT (strictly username-based) ---
def fetch_robert_gifs(query_text, limit=5):
    url = "https://api.giphy.com/v1/gifs/search"
    params = {
        "api_key": GIPHY_API_KEY,
        "q": query_text,
        "limit": limit,
        "rating": "g",
        "lang": "en",
        "username": "signwithrobert"
    }
    response = requests.get(url, params=params)
    data = response.json()

    gifs = []
    if data.get("data"):
        for gif in data["data"]:
            gif_url = gif["images"]["downsized"]["url"]
            gifs.append(gif_url)
    return gifs

# --- GIPHY GENERAL FETCHING (smart filter for ASL) ---
def fetch_sign_language_gifs(query_text, limit=5):
    url = "https://api.giphy.com/v1/gifs/search"
    params = {
        "api_key": GIPHY_API_KEY,
        "q": query_text,
        "limit": limit,
        "rating": "g",
        "lang": "en"
    }
    response = requests.get(url, params=params)
    data = response.json()

    gifs = []
    if data.get("data"):
        for gif in data["data"]:
            user = gif.get("user", {})
            title = gif.get("title", "").lower()
            username = user.get("username", "").lower()
            if "signwithrobert" in username or "sign" in title or "asl" in title:
                gif_url = gif["images"]["downsized"]["url"]
                gifs.append((gif_url, user.get("display_name", "Unknown")))
    return gifs

# --- DISPLAY BOTH SETS ---
def show_combined_gifs(query_text):
    st.write("### General ASL GIFs:")
    general_gifs = fetch_sign_language_gifs(query_text, limit=5)
    if general_gifs:
        for i, (gif_url, creator) in enumerate(general_gifs):
            st.image(gif_url, caption=f"{query_text.strip().capitalize()} ({i+1}) by {creator}")
    else:
        st.info("No general ASL GIFs found for this term.")

    st.write("### SignWithRobert GIFs:")
    robert_gifs = fetch_robert_gifs(query_text, limit=5)
    if robert_gifs:
        for i, gif_url in enumerate(robert_gifs):
            st.image(gif_url, caption=f"{query_text.strip().capitalize()} (Robert GIF {i+1})")
    else:
        st.info("No specific Robert GIFs found for this query.")

# --- EMBED DOCUMENTS ---
def create_vectorstore():
    if "vectors" not in st.session_state:
        with st.spinner("Fetching website content & creating embeddings..."):
            st.session_state.embeddings = HuggingFaceEmbeddings(
                model_name="sentence-transformers/all-MiniLM-L6-v2"
            )
            urls = [
                "https://www.startasl.com/american-sign-language-alphabet/",
                "https://deafchildren.org/2019/06/free-asl-alphabet-chart/",
                "https://adayinourshoes.com/sign-language-worksheet/"
            ]
            st.session_state.loader = WebBaseLoader(urls)
            st.session_state.docs = st.session_state.loader.load()
            st.session_state.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            st.session_state.final_docs = st.session_state.text_splitter.split_documents(st.session_state.docs[:5])
            st.session_state.vectors = FAISS.from_documents(st.session_state.final_docs, st.session_state.embeddings)
        st.success("Website Data Embedded Successfully!")

# --- BUTTON TO LOAD DATA ---
if st.button("Fetch & Embed Website Data"):
    create_vectorstore()

# --- USER INPUT ---
user_prompt = st.text_input("Ask your question related to Sign Language Communication:")

# --- GENERATE ANSWER ---
if user_prompt and st.button("Get Answer"):
    if "vectors" not in st.session_state:
        st.warning("Please click 'Fetch & Embed Website Data' first!")
    else:
        llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="Llama3-8b-8192")
        document_chain = create_stuff_documents_chain(llm, prompt)
        retriever = st.session_state.vectors.as_retriever()
        retrieval_chain = create_retrieval_chain(retriever, document_chain)

        start = time.process_time()
        response = retrieval_chain.invoke({'input': user_prompt})
        end = time.process_time()

        st.session_state.last_answer = response['answer']
        st.session_state.last_context = response['context']
        st.session_state.last_response_time = round(end - start, 2)

# --- DISPLAY ANSWER + GIFs ---
if "last_answer" in st.session_state:
    st.write(f"Response Time: {st.session_state.last_response_time} seconds")
    st.write("### Answer:", st.session_state.last_answer)

    # GIFs from both sources based on user prompt
    show_combined_gifs(user_prompt)

    # Read & Stop buttons
    col1, col2 = st.columns(2)
    with col1:
        if st.button("Read Answer Aloud"):
            speak_answer(st.session_state.last_answer)
    with col2:
        if st.button("Stop Reading"):
            stop_speaking()

    # Relevant Website Snippets
    with st.expander("Relevant Website Snippets:"):
        for doc in st.session_state.last_context:
            st.write(doc.page_content)
            st.write("---")
