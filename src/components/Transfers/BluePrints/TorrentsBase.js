import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useDispatch } from "react-redux";
import { clearMessages, readNotifications } from "../../../store/actions";
import Message from "../../../helpers/Notification";
import useFCMNotifications from "../../../helpers/useFCMNotifications";
import useEnableFCM from "../../../helpers/useEnableFCM";
import TorrentsInput from "./TorrentsInput";
import TorrentsTransferring from "./TorrentsTransferring";
import TransferringComponent from "./TransferringComponent";
import TransferredComponent from "./TransferredComponent";
import useGetNotifications from "../../../helpers/useGetNotifications";
import { useFirebase } from "react-redux-firebase";

/**
 *
 * @param {RegExp} regExpString
 * @param {string} dbPath
 * @param {string} validationErrorMessage
 * @param {function} submitFN
 * @param {JSX.Element} title
 * @param {string} placeholder
 * @param {string} toText
 * @param {IconDefinition} toIcon
 * @param {string} fromText
 * @param {IconDefinition} fromIcon
 * @param {string} toLink
 * @param {string} fromLink
 * @returns {JSX.Element}
 * @constructor
 */
const TorrentsBase = ({
  regExpString,
  dbPath,
  validationErrorMessage,
  submitFN,
  title,
  placeholder,
  toText,
  toIcon,
  toLink,
  fromText,
  fromIcon,
  fromLink,
}) => {
  const dispatch = useDispatch();
  const firebase = useFirebase();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  useEnableFCM();
  useFCMNotifications(setNotification, setNotificationOpen);
  useGetNotifications(setNotification, setNotificationOpen);

  useEffect(() => () => clearMessages()(dispatch), [dispatch]);

  const onNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationOpen(false);
    readNotifications()(firebase);
  };

  const classes = makeStyles((theme) => ({
    root: {
      minWidth: 350,
    },
    glass: {
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "1px",
      boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
      backdropFilter: "blur(2.1px)",
      border: "1px solid rgba(255, 255, 255, 0.24)",
      alignItems: "flex-start",
    },
    title: {
      fontSize: 14,
    },
    large: {
      paddingBottom: "6px",
      marginBottom: "2px",
      filter: "drop-shadow(0px 0px 15px #222)",
    },
    typography: {
      flexGrow: 1,
      textAlign: "center",
      color: theme.palette.text.primary,
    },
    button: {
      marginTop: theme.spacing(2),
      fontSize: "18px",
      width: "150px",
      "&:hover": {
        border: `1px solid ${theme.palette.action.success}`,
        color: theme.palette.action.success,
      },
    },
    fileUpload: {
      backgroundColor: theme.palette.background.paper,
      minHeight: "50px",
      marginBottom: "10px",
    },
  }))();

  return (
    <div className="container">
      {notification?.title && (
        <Message
          severity={"info"}
          alertTitle={`Transfer completed: ${notification.title}`}
          onClose={onNotificationClose}
          message={notification.body}
          open={notificationOpen}
          autoHideDuration={10000}
        />
      )}

      {notification?.job && (
        <Message
          severity={"error"}
          alertTitle={"Error occurred in transfer"}
          onClose={onNotificationClose}
          message={
            <>
              Error [{notification.error}] <br />
              occurred in transferring <br />
              {notification.job} <br />
            </>
          }
          open={notificationOpen}
          autoHideDuration={20000}
        />
      )}

      <TorrentsInput
        dbPath={dbPath}
        classes={classes}
        regExpString={regExpString}
        validationErrorMessage={validationErrorMessage}
        submitFN={submitFN}
        title={title}
        placeholder={placeholder}
      />

      <TorrentsTransferring classes={classes} dbPath={dbPath} />

      <TransferringComponent classes={classes} dbPath={dbPath} />

      <TransferredComponent
        classes={classes}
        dbPath={dbPath}
        toText={toText}
        toIcon={toIcon}
        toLink={toLink}
        fromText={fromText}
        fromIcon={fromIcon}
        fromLink={fromLink}
      />
    </div>
  );
};

export default TorrentsBase;
