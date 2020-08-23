import React, { FC } from 'react';
import { TextField, InputAdornment } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import assets from '../../assets';

const abandonedIcon = assets['icons/abandoned'];

type FactionAutocompleteProps = {
  options: any[];
  value: any;
  disabled?: boolean;
  showFactionIcon?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
};

const FactionAutocomplete: FC<FactionAutocompleteProps> = ({
  options = [],
  value = null,
  disabled = false,
  showFactionIcon = true,
  label,
  placeholder,
  helperText,
  onChange,
}) => {
  return (
    <Autocomplete
      size="small"
      options={options}
      value={value}
      onChange={onChange}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.name}
      disabled={disabled}
      renderOption={(option) =>
        <FactionAutocompleteItem option={option} />
      }
      renderInput={(params) =>
        <FactionAutocompleteInput
          params={params}
          value={value}
          label={label}
          helperText={helperText}
          showFactionIcon={showFactionIcon}
          placeholder={placeholder}
        />
      }
    />
  );
}

const FactionAutocompleteItem = (props: any) => {
  return (
    <>
      <img src={props.option.icon} alt="" />
      {props.option.name}
    </>
  )
};

const FactionAutocompleteInput = (props: any) => {
  const icon = props.showFactionIcon
    ? props.value?.icon ?? abandonedIcon
    : null;

  const inputAdornment = (
    <InputAdornment position="start">
      <img src={icon} alt="" />
    </InputAdornment>
  );

  return (
    <TextField
      {...props.params}
      label={props.label}
      helperText={props.helperText}
      variant="outlined"
      placeholder={props.placeholder}
      InputLabelProps={{ shrink: true }}
      InputProps={{ ...props.params.InputProps, startAdornment: inputAdornment }}
    />
  )
};

export default FactionAutocomplete;
