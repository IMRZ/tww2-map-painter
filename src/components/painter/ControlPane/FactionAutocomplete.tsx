import React from 'react';
import { TextField, InputAdornment, Typography } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';

import assets from '../../../assets';
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
  getOptionSelected?: (option: any, value: any) => boolean;
};

const FactionAutocomplete = ({
  options = [],
  value = null,
  disabled = false,
  showFactionIcon = true,
  label,
  placeholder,
  helperText,
  onChange,
  getOptionSelected,
}: FactionAutocompleteProps) => {
  return (
    <Autocomplete
      size="small"
      options={options}
      value={value}
      getOptionSelected={getOptionSelected}
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
      <img style={{ width: 24, height: 24, marginRight: 12 }} src={props.option.icon} alt="" />
      <Typography noWrap>{props.option.name}</Typography>
    </>
  )
};

const FactionAutocompleteInput = (props: any) => {
  const icon = props.showFactionIcon
    ? props.value?.icon ?? abandonedIcon
    : null;

  const inputAdornment = icon && (
    <InputAdornment position="start">
      <img style={{ width: 24, height: 24 }} src={icon} alt="" />
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
