import os  
os.environ['PROTOCOL_BUFFERS_PYTHON_IMPLEMENTATION'] = 'python'
from inference import predict_sentence
from get_info import Get_items,Get_item
from cloud import generate_wordcloud
from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app)


@app.route('/get_info', methods=['POST'])
def get_info():
    # 获取请求体中的数据
    data = request.json
    
    if not data:
        return jsonify({"错误": "请求数据为空"}), 400
    
    # 从请求数据中获取num参数
    num = data.get('num', None)
    
    if num is None:
        return jsonify({"错误": "缺少参数"}), 400
    
    # 调用 Get_items 函数获取数据
    rows = Get_items(num)
    
    # 返回获取到的数据
    return jsonify(rows)



@app.route('/get_item', methods=['POST'])
def get_item():
    # 获取请求体中的数据
    data = request.json
    if not data:
        return jsonify({"错误": "请求数据为空"}), 400
    id = data.get('id', None)
    
    # 调用 Get_item 函数获取数据
    item = Get_item(id)
    
    # 返回获取到的数据
    return jsonify(item)
    
    
@app.route('/pred', methods=['POST'])
def pred():
    if not request.data:
        return jsonify({"错误": "请求数据为空"}), 400
    input_string = request.data.decode('utf-8')

    if not isinstance(input_string, str):
        return jsonify({'错误': '请求内容必须是字符串'}), 400
    if not input_string.strip():
        return jsonify({"错误": "请求数据没有字符串"}), 400
    
    list_sentiment = ["愤怒", "恐惧", "积极", "无情绪", "悲伤", "惊奇"]

    result = predict_sentence(input_string)
    retn = {"sentiment": result[0], "possibility": list(zip(list_sentiment, result[1].tolist()))}
    return jsonify(retn)



@app.route('/cloud', methods=['POST'])
def cloud():
    data = request.json  # 获取JSON格式的请求数据

    if not data:
        return jsonify({"错误": "请求数据为空"}), 400
    if not isinstance(data, list):
        return jsonify({'错误': '请求内容必须是字符串数组'}), 400
 
    result = generate_wordcloud(*data)  # 将字符串数组传递给generate_wordcloud函数
    return jsonify({'image': result})



if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)