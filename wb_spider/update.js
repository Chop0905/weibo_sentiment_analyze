const fs = require("fs");
function update(filepath, newObjects) {
    let counter = 0;
    fs.readFile(filepath, 'utf8', (err, data) => {
            if (err) {
                console.error('读取文件时出错：', err);
                return;
            }
            let objects = [];
            if (data) {
                // 解析JSON字符串成对象数组
                objects = JSON.parse(data);
            }
            for (let i = 0; i < newObjects.length; i++) {
                let newObject = newObjects[i];
                // 查找是否已存在具有相同id的对象
                const existingIndex = objects.findIndex(obj => obj.name === newObject.name);
                if (existingIndex !== -1) {
                    // 如果存在，则更新现有对象
                    objects[existingIndex] = newObject;
                    ++counter;
                    //console.log(`已将名为：${newObject.name} 的热搜更新到最新。`);
                } else {
                    // 如果不存在，则添加新对象
                    objects.push(newObject);
                }
                // 将更新后的对象数组转换为JSON格式的字符串
                const jsonData = JSON.stringify(objects, null, 2);
                // 将JSON字符串写入文件
                fs.writeFile(filepath, jsonData, (err) => {
                    if (err) {
                        console.error('写入文件时出错：', err);
                        return;
                    }
                });
            }
        }
    );
    return counter;
}

module.exports = {
    update: update
};
