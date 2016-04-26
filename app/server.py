import os
from flask import Flask, jsonify, render_template
from wordnik import swagger, WordApi
from sets import Set
app = Flask(__name__)

def get_synonyms(word):
    api_url = 'http://api.wordnik.com/v4'
    api_key = '495685498a8807c1d60070b8cd908c4dd54326674bcc6ddb9'
    client = swagger.ApiClient(api_key, api_url)
    word_api = WordApi.WordApi(client)
    related_words = word_api.getRelatedWords(word, limitPerRelationshipType=100)

    set_words = Set([word]) # initialize the set of words
    
    for word_group in related_words:
        if word_group.relationshipType in ['equivalent', 'synonym']: # just grab in equivalent and synonym
            set_words = set_words | Set(word_group.words) # union of words to prevent duplicates

    return list(set_words);


# def get_songs(words):
#     api_url = 'http://192.241.182.160:9200/songs/lyrics/_search?q='
#     word_api = WordApi.WordApi(client)
#     related_words = word_api.getRelatedWords(word, limitPerRelationshipType=100)

#     set_words = Set([word]) # initialize the set of words
    
#     for word_group in related_words:
#         if word_group.relationshipType in ['equivalent', 'synonym']: # just grab in equivalent and synonym
#             set_words = set_words | Set(word_group.words) # union of words to prevent duplicates

#     return list(set_words);

@app.route("/")
def hello():
    return render_template("hello.html")

@app.route("/api/synonyms/<word>")
def synonym(word):
    return jsonify(data=get_synonyms(word))

# @app.route("/api/songs/<words>")
# def songs(words):
#     return jsonify(data=get_songs(words))


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)