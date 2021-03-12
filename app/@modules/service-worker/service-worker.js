// --------------------------------------------------
//   Event: push
// --------------------------------------------------

self.addEventListener("push", function (eventObj) {
  // --------------------------------------------------
  //   Payload
  // --------------------------------------------------

  // console.log('eventObj', eventObj);
  // alert(eventObj);

  if (eventObj.data) {
    // --------------------------------------------------
    //   Payload Object
    // --------------------------------------------------

    let payloadObj = {};

    try {
      payloadObj = eventObj.data.json();
    } catch (errorObj) {
      payloadObj = {
        body: eventObj.data.text(),
      };
    }

    // --------------------------------------------------
    //   Title
    // --------------------------------------------------

    const title = payloadObj.title || "Game Users";

    // --------------------------------------------------
    //   Options
    // --------------------------------------------------

    const optionsObj = {
      body: payloadObj.body,
      icon: payloadObj.icon,
      tag: payloadObj.tag,
      data: {
        url: payloadObj.url,
      },
    };

    // console.log('title', title);
    // console.log('optionsObj', optionsObj);

    // --------------------------------------------------
    //   Notification
    // --------------------------------------------------

    eventObj.waitUntil(self.registration.showNotification(title, optionsObj));
  }
});

// --------------------------------------------------
//   Event: notificationclick
// --------------------------------------------------

self.addEventListener("notificationclick", (eventObj) => {
  // --------------------------------------------------
  //   表示された通知を明示的に閉じる
  // --------------------------------------------------

  eventObj.notification.close();

  // console.log('eventObj.notification.data.url', eventObj.notification.data.url);

  // --------------------------------------------------
  //   URL に遷移する
  // --------------------------------------------------

  if (eventObj.notification.data.url) {
    eventObj.waitUntil(self.clients.openWindow(eventObj.notification.data.url));
  }
});
