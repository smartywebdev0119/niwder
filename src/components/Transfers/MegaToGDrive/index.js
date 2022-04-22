import React from "react";
import { queueTransfer } from "../../../store/actions";
import TransferBase from "../TransfersBase";
import SecondaryComponent from "../TransfersBase/SecondaryComponent";
import TransferringComponent from "../TransfersBase/TransferringComponent";
import { faM } from "@fortawesome/free-solid-svg-icons/faM";
import { faGoogleDrive } from "@fortawesome/free-brands-svg-icons/faGoogleDrive";
import { megaRe } from "../../../config/Constants";

const secondary = ({ gDriveLink, megaLink, size, mimeType, timestamp }) => (
  <SecondaryComponent
    primaryLink={gDriveLink}
    primaryText={"Google Drive Link"}
    secondaryLink={megaLink}
    secondaryText={"Mega.nz Link"}
    size={size}
    mimeType={mimeType}
    timestamp={timestamp}
    primaryIcon={faGoogleDrive}
    secondaryIcon={faM}
  />
);

const transferring = ({ message, percentage }) => (
  <TransferringComponent primaryText={message} percentage={percentage} />
);

const MegaToGDrive = () => {
  return (
    <TransferBase
      dbPath={"mega-to-gdrive"}
      regExpString={megaRe}
      validationErrorMessage={
        "The URL must be a valid Mega.nz file/folder export URL"
      }
      submitFN={queueTransfer}
      title={<>Add a Mega.nz link to convert to a Google Drive link</>}
      placeholder={"Mega.nz Link"}
      secondaryComponent={secondary}
      transferringComponent={transferring}
    />
  );
};

export default MegaToGDrive;
