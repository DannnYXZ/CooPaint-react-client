export function post(url, object, ok_callback, fail_callback) {
  fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(object),
        mimeType: 'application/json',
        headers: {
          'Accept': 'application/json; charset=UTF-8',
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }
  ).then(response => {
    response.text().then(text => {
      let json = text ? JSON.parse(text) : {};
      if (response.ok) {
        console.log("this in post", this);
        if (ok_callback) ok_callback(json);
      } else {
        if (fail_callback) fail_callback(json);
      }
    });
  });
}