export function post(url, object, ok_callback, fail_callback) {
  fetch(url, {
        method: 'POST',
        //mode: 'no-cors',
        credentials: 'include',
        body: JSON.stringify(object),
        mimeType: 'application/json',
        //contentType: 'application/json',
        //responseType: 'application/json',
        headers: {
          'Accept': 'application/json; charset=UTF-8',
          'Access-Control-Allow-Headers': 'application/json',
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }
  ).then(response => {
    if (response.status === 200) {
      console.log("status 200:");
      console.log(response);
      return response.json();
    } else {
      console.log("fail");
      if (fail_callback) fail_callback();
    }
  }).then(json => {
        console.log(json);
        if (ok_callback) ok_callback(json);
      }
  );
}