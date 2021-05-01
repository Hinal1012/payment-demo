import requests
import json
from django.http import HttpResponse
from http import HTTPStatus

class Worldpay:

    WORLDPAY_SERVICE_KEY = 'T_S_5a3769d2-1139-4d15-b6ed-339a91df1059'
    WORLDPAY_ORDERS_URL = 'https://api.worldpay.com/v1/orders/'

    @classmethod
    def create_charge(cls, token, amount, order_description, currency_code):
        response = requests.post(cls.WORLDPAY_ORDERS_URL,
                                 data=_generate_payload(token=token, amount=amount, order_description=order_description, currency_code=currency_code),
                                 headers=_generate_headers(cls.WORLDPAY_SERVICE_KEY))
                                
        if response.status_code is HTTPStatus.OK.value:
            orderCode = json.loads(response.text)["orderCode"]
            order_details = requests.get('https://api.worldpay.com/v1/orders/'+ orderCode, headers=_generate_headers(cls.WORLDPAY_SERVICE_KEY))
            return {'status_code': response.status_code, 'message':json.loads(response.text)["paymentStatus"], 'order_code':json.loads(response.text)["orderCode"]}
        else:
            return {'status_code': response.status_code, 'message':json.loads(response.text)["customCode"]}

def _generate_payload(token, amount, order_description, currency_code):
    return json.dumps({ "token" : token, "amount" : _remove_decimal(amount), "orderDescription" : order_description, "currencyCode" : currency_code })

def _generate_headers(worldpay_service_key):
    return {'Authorization': worldpay_service_key, 'Content-type': 'application/json'}

def _remove_decimal(amount):
    return str(int(float(amount) * 100))
