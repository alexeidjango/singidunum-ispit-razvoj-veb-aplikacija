import type { PaymentOrderFormValues } from "../schemas/paymentOrder";
import { formatBankAccount } from "../utils/bankAccount";
import { formatAmountSerbian } from "../utils/amount";
import styles from "./PaymentSlipPrint.module.css";

interface PaymentSlipPrintProps {
  values: PaymentOrderFormValues;
}

/**
 * Print-only representation of the payment order (Serbian "Nalog za uplatu").
 * Hidden on screen; visible only when printing (see PaymentSlipPrint.module.css).
 * Values are passed in live from the form (react-hook-form `watch()`).
 */
const PaymentSlipPrint = ({ values }: PaymentSlipPrintProps) => (
  <div className={styles.root}>
    <div className={styles.outer}>
      <div className="d-flex flex-row-reverse">
        <div className={styles.title}>НАЛОГ ЗА УПЛАТУ</div>
      </div>
      <div className={styles.body}>
        {/* Left column */}
        <div className={styles.left}>
          <div className={styles.field}>
            <div className={styles.label}>уплатилац</div>
            <div className={`${styles.box} ${styles.boxTall}`}>
              <span>{values.sender_name}</span>
              <br />
              <span>{values.sender_address}</span>
            </div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>сврха уплате</div>
            <div className={styles.box}>{values.payment_purpose}</div>
          </div>
          <div className={styles.field}>
            <div className={styles.label}>прималац</div>
            <div className={`${styles.box} ${styles.boxTall}`}>
              <span>{values.recipient_full_name}</span>
              <br />
              <span>{values.recipient_address}</span>
            </div>
          </div>
          <div className={styles.footerLeft}>
            <div className={styles.underline} />
            <div className={styles.label}>печат и потпис уплатиоца</div>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.right}>
          <div className={styles.rowTop}>
            <div className={`${styles.field} ${styles.fieldSm}`}>
              <div className={styles.label}>шифра плаћања</div>
              <div className={styles.box}>{values.payment_code}</div>
            </div>
            <div className={`${styles.field} ${styles.fieldSm}`}>
              <div className={styles.label}>валута</div>
              <div className={styles.box}>{values.currency}</div>
            </div>
            <div className={`${styles.field} ${styles.fieldGrow}`}>
              <div className={styles.label}>износ</div>
              <div className={styles.box}>
                {formatAmountSerbian(values.amount)}
              </div>
            </div>
          </div>

          <div className={styles.field}>
            <div className={styles.label}>рачун примаоца</div>
            <div className={styles.box}>
              {formatBankAccount(values.bank_account ?? "")}
            </div>
          </div>

          <div className={styles.rowBottom}>
            <div className={`${styles.field} ${styles.fieldSm}`}>
              <div className={styles.label}>број модела</div>
              <div className={styles.box}>{values.reference_model}</div>
            </div>
            <div className={`${styles.field} ${styles.fieldGrow}`}>
              <div className={styles.label}>позив на број (одобрење)</div>
              <div className={styles.box}>{values.reference_number}</div>
            </div>
          </div>

          <div className={styles.footerRight}>
            <div className={styles.footerCol}>
              <div className={styles.underline} />
              <div className={styles.label}>место и датум пријема</div>
            </div>
            <div className={styles.footerCol}>
              <div className={styles.underline} />
              <div className={styles.label}>датум валуте</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default PaymentSlipPrint;
