import jieba
from io import BytesIO
import wordcloud
from wordcloud import WordCloud,ImageColorGenerator
import base64

def generate_wordcloud(*args, load_stopwords=True):
    text=''
    for comment in args:
        text+=comment
    stopwords = set()
    if load_stopwords:
        with open("stopwords.txt", encoding="utf-8") as f:
            stopwords = set(f.read().splitlines())
    
    cut_text = " ".join(word for word in jieba.cut(text))
    wordcloud = WordCloud(font_path="C:/Windows/Fonts/simfang.ttf",
                          background_color=(242,242,242), height=300, width=500,
                          scale=5, prefer_horizontal=0.9,max_font_size=100, stopwords=stopwords).generate(cut_text)
    img_io=BytesIO()
    wordcloud.to_image().save(img_io,format='PNG')
    img_io.seek(0)
    img_data=img_io.read()
    # 将图像数据编码为 BASE64 格式字符串
    base64_image = base64.b64encode(img_data).decode('utf-8')
    
    return base64_image
