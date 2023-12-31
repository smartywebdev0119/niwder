import React, { useCallback, useState } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import FolderIcon from "@mui/icons-material/Folder";
import ListItemText from "@mui/material/ListItemText";
import CustomizedToolTip from "../../../helpers/CustomizedToolTip";
import Typography from "@mui/material/Typography";
import ConfirmationDialog from "../../../helpers/ConfirmationDialog";
import { confirmationMessages } from "../../../config/Constants";
import { removeTransferred } from "../../../store/actions";
import { common, red } from "@mui/material/colors";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Link from "@mui/material/Link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import prettyBytes from "pretty-bytes";
import TimeAgo from "react-time-ago";
import { useFirebase } from "react-redux-firebase";

/**
 *
 * @param {object} classes
 * @param {object} data
 * @param {string} dbPath
 * @param {string} id
 * @param {string} toText
 * @param {IconDefinition} toIcon
 * @param {string} fromText
 * @param {IconDefinition} fromIcon
 * @param {string} toLink
 * @param {string} fromLink
 * @returns {JSX.Element}
 * @constructor
 */
const TransferredItem = ({
  classes,
  data,
  dbPath,
  id,
  toText,
  toIcon,
  fromText,
  fromIcon,
  toLink,
  fromLink,
}) => {
  const { key, name, size, mimeType, timestamp } = data;

  const [open, setOpen] = useState(false);
  const firebase = useFirebase();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleRemoveTransferred = useCallback(() => {
    setOpen(true);
  }, []);

  const onRemoveTransferred = useCallback(
    () => removeTransferred(dbPath, key)(firebase),
    [firebase, dbPath, key]
  );

  return (
    <React.Fragment key={id}>
      <ListItem alignItems="flex-start" className={classes.glass}>
        <ListItemAvatar>
          <Avatar>
            <FolderIcon color="action" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <CustomizedToolTip arrow placement="top" title={name}>
              <Typography
                sx={{
                  display: "inline-block",
                  maxWidth: "40vw",
                }}
                component="span"
                variant="h6"
                color="text.primary"
                noWrap
              >
                {name}
              </Typography>
            </CustomizedToolTip>
          }
          secondary={
            <React.Fragment>
              <Link
                href={data[toLink]}
                underline={"hover"}
                variant="body1"
                target="_blank"
                rel="noopener noreferrer"
                color="white"
              >
                <FontAwesomeIcon icon={toIcon} /> {toText}
              </Link>
              <br />
              <Link
                href={data[fromLink]}
                underline={"hover"}
                variant="body1"
                target="_blank"
                color="white"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon icon={fromIcon} /> {fromText}
              </Link>
              <br />
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                {prettyBytes(size)} [{mimeType}]
              </Typography>
              <br />
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="body2"
                color="text.primary"
              >
                Transferred: <TimeAgo date={timestamp} />
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemAvatar
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <ConfirmationDialog
            id="remove-completed"
            keepMounted
            open={open}
            onClose={handleClose}
            primaryMessage={"Removing Transferred File"}
            secondaryMessage={confirmationMessages[dbPath]}
            action={onRemoveTransferred}
          />
          <CustomizedToolTip arrow placement="top" title="Remove">
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: common["black"],
                cursor: "pointer",
              }}
              onClick={handleRemoveTransferred}
            >
              <RemoveCircleIcon
                sx={{ color: red["A700"] }}
                fontSize="inherit"
              />
            </Avatar>
          </CustomizedToolTip>
        </ListItemAvatar>
      </ListItem>
    </React.Fragment>
  );
};

export default React.memo(TransferredItem);
