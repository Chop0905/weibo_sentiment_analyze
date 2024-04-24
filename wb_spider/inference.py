from paddlenlp. transformers import AutoModelForSequenceClassification, AutoTokenizer
import paddle.nn.functional as F
import paddle
import re
model=AutoModelForSequenceClassification.from_pretrained("C:/Users/ASUS/毕设/work/model",num_classes=6)
tokenizer = AutoTokenizer.from_pretrained("bert-base-chinese")

class TokenItem:
    def __init__(self,sentence,tokenizer):
        self.tokenizer=tokenizer
        self.token=tokenizer(
            [sentence],
            max_length=512,
            padding='max_length'
        )
    def __del__(self):
        pass

def get_sentiment(label):
    hashmap={0:"愤怒",1:"恐惧",2:"积极",3:"无情绪",4:"悲伤",5:"惊奇"}
    return hashmap[label]

def scentence_preprocessing(sentence):
    return re.sub(r'#.*?#', '', sentence)

def predict_sentence(sentence):
    with paddle.no_grad():
        tokenItem=TokenItem(sentence,tokenizer)
        outputs = model(input_ids=paddle.to_tensor(tokenItem.token.input_ids,dtype='int64'),
                            token_type_ids=paddle.to_tensor(tokenItem.token.token_type_ids,dtype='int64'))
        del tokenItem
        result = paddle.argmax(outputs[0])
        label=result.numpy()
        sentiment=get_sentiment(int(label))
        out1 = F.softmax(outputs[0])
        
    return sentiment,out1

