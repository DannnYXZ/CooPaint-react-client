const appName = "/coopaint";

export function request(method, url, object, ok_callback, fail_callback) {
  fetch(appName + url, {
        method: method,
        credentials: 'include',
        body: object ? JSON.stringify(object) : null,
        mimeType: 'application/json',
        headers: {
          'Accept': 'application/json; charset=UTF-8',
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }
  ).then(response => {
    response.text().then(text => {
      console.log(text);
      let json = text ? JSON.parse(text) : {};
      if (response.ok) {
        if (ok_callback) ok_callback(json);
      } else {
        if (fail_callback) fail_callback(json);
      }
    });
  });
}

export async function post_async(method, url, object, ok_callback, fail_callback) {
  const response = await fetch(appName + url, {
        method: method,
        credentials: 'include',
        body: JSON.stringify(object),
        mimeType: 'application/json',
        headers: {
          'Accept': 'application/json; charset=UTF-8',
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }
  );
  const text = await response.text();
  let json = text ? JSON.parse(text) : {};
  if (response.ok) {
    // console.log("this in request", this);
    if (ok_callback) ok_callback(json);
  } else {
    if (fail_callback) fail_callback(json);
  }
}

export function sendRequest(file) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();

    const formData = new FormData();
    formData.append("file", file, file.name);

    req.open("POST", "/api/upload-avatar");
    req.send(formData);
  });
}