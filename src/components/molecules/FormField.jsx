import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required,
  id,
  ...inputProps 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <Label htmlFor={id} required={required}>
          {label}
        </Label>
      )}
      <Input 
        id={id}
        error={error}
        {...inputProps}
      />
      {error && (
        <p className="text-sm text-error mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;