import mysql.connector
import base64

def Get_items(num):
    # 连接数据库
    conn = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="123456789",
        database="spider"
    )


    # 创建游标对象
    cursor = conn.cursor()
    # 执行 SQL 查询
    cursor.execute('''SELECT * FROM (
                  SELECT id, name, popularity, content, comments, url, sentiment
                  FROM posts
                  ORDER BY time DESC LIMIT 50
                  ) AS subquery
                  ORDER BY popularity DESC LIMIT {};'''.format(num))
    # 获取查询结果
    rows = cursor.fetchall()
    # 打印查询结果
    # 关闭游标和连接
    cursor.close()
    conn.close()
    return rows


def Get_item(id):
    # 连接数据库
    conn = mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="123456789",
        database="spider"
    )
    # 创建游标对象
    cursor = conn.cursor()
    # 执行 SQL 查询
    cursor.execute("SELECT name,popularity,content,time,comments,url,sentiment,image_data FROM posts where id={};".format(id))
    # 获取查询结果
    row = cursor.fetchone()
    # 关闭连接
    conn.close()
    # 将字节数据转换为 BASE64 编码的字符串
    image_data = base64.b64encode(row[7]).decode('utf-8') if row[7] else None

    # 构造返回的 JSON 对象
    item = {
        "name": row[0],
        "popularity": row[1],
        "content": row[2],
        "time": row[3],
        "comments": row[4],
        "url": row[5],
        "sentiment": row[6],
        "image_data": image_data
    }

    return item