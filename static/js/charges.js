$(function () {

  $('#worldpayFormModal').on('hidden.bs.modal', function () {
      hideSpinner();
      hideMessage();
  });

  $('#worldpay-form').submit(function (e) {
      e.preventDefault();
      showSpinner();
      $('#submit-btn').prop("disabled", true);
  });

  Worldpay.useOwnForm({
    'clientKey': 'T_C_953789dc-9e21-4413-a012-2f5a18cadc1a',
    'form': document.getElementById('worldpay-form'),
    'reusable': true,
    'callback': worldpayResponseHandler
  });

  function worldpayResponseHandler(status, response) {
    console.log(response);
    if (response.error) {
      handleErrors(response.error);
    }
    else {
      // if(response.token != null){
        $.post('/auth/', {'worldpayToken': response.token, 'amount': $('#amount').val(), 'currency': $('#currency').val()})
            .done(result => showSuccess(result))
            .fail(error => handleErrors(error))
            .always(function () {
                $('#submit-btn').prop("disabled", false);
            });
      // }
    }
  };

  function showSuccess(result) {
    hideSpinner();
    showMessage(result.order_code);
  };

  function handleErrors(error) {
    if(error.message != null){
      showMessage(error.message);
    }
    else if (error.responseText != null) {
      showMessage(error.responseText);
    }
    else{
      showMessage(error);
    }
 };

  function showSpinner() {
      $('#spinner-container').show();
      $('#worldpay-form').hide();
  };

  function hideSpinner() {
      $('#spinner-container').hide();
      $('#worldpay-form').show();
  };

  function showMessage(message) {
      $('#message-text').text(message);
      $('#worldpay-form').hide();
      $('#spinner-container').hide();
      $('#message-container').show();
  };

  function hideMessage() {
      $('#message-container').hide();
      $('#worldpay-form').show();
  };
});

$(function () {
    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    var csrftoken = getCookie('csrftoken');

    /*
     The functions below will create a header with csrftoken
     */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
