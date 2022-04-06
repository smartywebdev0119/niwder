import React from "react";
import { queueTransfer } from "../../../store/actions";
import TransfersBase from "../TransfersBase";
import SecondaryComponent from "../TransfersBase/SecondaryComponent";
import TransferringComponent from "../TransfersBase/TransferringComponent";

const secondary = ({ gDriveLink, megaLink, size, mimeType, timestamp }) => (
  <SecondaryComponent
    primaryLink={megaLink}
    primaryText={"Mega.nz Link"}
    secondaryLink={gDriveLink}
    secondaryText={"Google Drive Link"}
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

const GDriveToMega = () => {
  return (
    <TransfersBase
      dbPath={"gdrive-to-mega"}
      regExpString={
        /(https:\/\/drive\.google\.com\/file\/d\/.*?\/.*?\??.*$|^https:\/\/drive\.google\.com\/drive\/folders\/.*\?.*$)/g
      }
      validationErrorMessage={
        "The URL must be a valid Google Drive file/folder export URL"
      }
      submitFN={queueTransfer}
      title={<>Add a Google Drive link to convert to a Mega.nz link</>}
      placeholder={"Google Drive Link"}
      secondaryComponent={secondary}
      transferringComponent={transferring}
    />
  );
};

export default GDriveToMega;