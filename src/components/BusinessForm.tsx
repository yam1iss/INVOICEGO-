import type { LineTheme } from "../data/lineThemes";
import { PLACEHOLDERS } from "../data/placeholders";
import type { BusinessInfo } from "../types/invoice";
import { Field } from "./Field";
import { Input } from "./Input";
import { LineThemePicker } from "./LineThemePicker";
import { LogoUploader } from "./LogoUploader";
import { Textarea } from "./Textarea";

type BusinessFormProps = {
  business: BusinessInfo;
  lineTheme: LineTheme;
  onChange: (patch: Partial<BusinessInfo>) => void;
  onLogoSelect: (file: File) => void;
  onLogoRemove: () => void;
  onLineThemeChange: (theme: LineTheme) => void;
};

export function BusinessForm({
  business,
  lineTheme,
  onChange,
  onLogoSelect,
  onLogoRemove,
  onLineThemeChange,
}: BusinessFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <LogoUploader
        logo={business.logo}
        onSelect={onLogoSelect}
        onRemove={onLogoRemove}
      />
      <LineThemePicker theme={lineTheme} onThemeChange={onLineThemeChange} />
      <Field label="Business name" htmlFor="business-name">
        <Input
          id="business-name"
          value={business.name}
          placeholder={PLACEHOLDERS.businessName}
          autoComplete="organization"
          onChange={(event) => onChange({ name: event.target.value })}
        />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="business-email">
          <Input
            id="business-email"
            type="email"
            value={business.email}
            placeholder={PLACEHOLDERS.businessEmail}
            autoComplete="email"
            onChange={(event) => onChange({ email: event.target.value })}
          />
        </Field>
        <Field label="Phone" htmlFor="business-phone">
          <Input
            id="business-phone"
            type="tel"
            value={business.phone}
            placeholder={PLACEHOLDERS.businessPhone}
            autoComplete="tel"
            onChange={(event) => onChange({ phone: event.target.value })}
          />
        </Field>
      </div>
      <Field label="Address" htmlFor="business-address">
        <Textarea
          id="business-address"
          value={business.address}
          placeholder={PLACEHOLDERS.businessAddress}
          rows={3}
          autoComplete="street-address"
          onChange={(event) => onChange({ address: event.target.value })}
        />
      </Field>
      <Field label="Website" htmlFor="business-website">
        <Input
          id="business-website"
          type="text"
          inputMode="url"
          value={business.website}
          placeholder={PLACEHOLDERS.businessWebsite}
          autoComplete="url"
          onChange={(event) => onChange({ website: event.target.value })}
        />
      </Field>
    </div>
  );
}
