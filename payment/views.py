from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.http import HttpResponse
import json
from worldpay.worldpay import Worldpay

Worldpay.WORLDPAY_SERVICE_KEY = settings.WORLDPAY_SERVICE_KEY
Worldpay.WORLDPAY_ORDERS_URL = settings.WORLDPAY_ORDERS_URL

@require_http_methods(['GET'])
def main(request):
    return render(request, "index.html")

@require_http_methods(['POST'])
def auth(request):
    response = Worldpay.create_charge(
        token=request.POST.get('worldpayToken'),
        amount=request.POST.get('amount'),
        order_description = 'My order description',
        currency_code = request.POST.get('currency')
    )
    return HttpResponse(json.dumps(response), content_type="application/json")
