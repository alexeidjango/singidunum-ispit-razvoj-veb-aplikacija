from django.core.exceptions import ValidationError

BANK_CODE_LENGTH = 3
ACCOUNT_NUMBER_LENGTH = 13
CONTROL_NUMBER_LENGTH = 2
FULL_LENGTH = BANK_CODE_LENGTH + ACCOUNT_NUMBER_LENGTH + CONTROL_NUMBER_LENGTH


def normalize_serbian_bank_account(value: str) -> str:
    if not value:
        raise ValidationError("Bank account is required.")

    raw = value.strip()
    if "-" in raw:
        parts = raw.split("-")
        if len(parts) != 3:
            raise ValidationError("Invalid bank account format.")
        bank_code, account_number, control_number = (part.strip() for part in parts)
    elif len(raw) == FULL_LENGTH:
        bank_code = raw[:BANK_CODE_LENGTH]
        account_number = raw[BANK_CODE_LENGTH:BANK_CODE_LENGTH + ACCOUNT_NUMBER_LENGTH]
        control_number = raw[-CONTROL_NUMBER_LENGTH:]
    else:
        raise ValidationError("Invalid bank account format.")

    if not (bank_code.isdigit() and account_number.isdigit() and control_number.isdigit()):
        raise ValidationError("Bank account must contain digits only.")

    if len(bank_code) != BANK_CODE_LENGTH:
        raise ValidationError("Bank code must be 3 digits.")
    if len(control_number) != CONTROL_NUMBER_LENGTH:
        raise ValidationError("Control number must be 2 digits.")
    if not 1 <= len(account_number) <= ACCOUNT_NUMBER_LENGTH:
        raise ValidationError("Account number must be between 1 and 13 digits.")

    return f"{bank_code}{account_number.zfill(ACCOUNT_NUMBER_LENGTH)}{control_number}"
