import React from "react";
import { queueTransfer } from "../../../store/actions";
import TransfersBase from "../TransfersBase";
import SecondaryComponent from "../TransfersBase/SecondaryComponent";
import TransferringComponent from "../TransfersBase/TransferringComponent";

const secondary = ({ gDriveLink, directLink, size, mimeType, timestamp }) => (
  <SecondaryComponent
    primaryLink={gDriveLink}
    primaryText={"Google Drive Link"}
    secondaryLink={directLink}
    secondaryText={"Direct Link"}
    size={size}
    mimeType={mimeType}
    timestamp={timestamp}
  />
);

const transferring = ({ stdout, message, percentage }) => (
  <TransferringComponent
    primaryText={message}
    secondaryText={stdout}
    percentage={percentage}
  />
);

const DirectToGDrive = () => {
  return (
    <TransfersBase
      dbPath={"direct-to-gdrive"}
      regExpString={
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/g
      }
      validationErrorMessage={"Provide a valid direct download URL"}
      submitFN={queueTransfer}
      title={<>Add a direct link to convert to a Google Drive link</>}
      placeholder={"Direct Link"}
      secondaryComponent={secondary}
      transferringComponent={transferring}
    />
  );
};

export default DirectToGDrive;