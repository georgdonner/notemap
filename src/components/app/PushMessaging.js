import { useEffect, useState } from "react";
import { useFirestore, useMessaging } from "reactfire";
import { Toast, ToastContainer } from "react-bootstrap";

const PushMessaging = ({ user }) => {
  const messaging = useMessaging();
  const firestore = useFirestore();
  const { FieldValue } = useFirestore;

  const [token, setToken] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [notification, setNotification] = useState();

  useEffect(() => {
    if (!user) {
      return;
    }

    const getToken = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const serviceWorkerRegistration = await navigator.serviceWorker.ready;
          const currentToken = await messaging.getToken({
            vapidKey: process.env.REACT_APP_FCM_PUSH_KEY,
            serviceWorkerRegistration,
          });
          if (!currentToken) {
            throw new Error("No token received");
          }

          firestore
            .collection("users")
            .doc(user.uid)
            .update({
              messagingTokens: FieldValue.arrayUnion(currentToken),
            });

          setToken(currentToken);
        } catch (error) {
          console.log("Could not get FCM messaging token", error);
        }
      }
    };

    getToken();

    const unsubscribe = messaging.onMessage((payload) => {
      setNotification(payload.notification);
      setShowToast(true);
    });

    return () => {
      unsubscribe();
    };
  }, [messaging, firestore, FieldValue, user]);

  if (!token || !notification) {
    return null;
  }

  return (
    <ToastContainer position="top-end">
      <Toast show={showToast} onClose={() => setShowToast(false)}>
        <Toast.Header>
          {notification.image ? (
            <img
              src={notification.image}
              className="rounded me-2"
              alt=""
              style={{ maxWidth: "100px" }}
            />
          ) : null}
          <strong className="me-auto">{notification.title}</strong>
        </Toast.Header>
        <Toast.Body>{notification.body}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default PushMessaging;
