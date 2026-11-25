import styles from './Spinner.module.css';

type SpinnerProps = {
  size?: number;
};

export const Spinner = ({ size = 28 }: SpinnerProps) => (
  <span className={styles.spinner} style={{ width: size, height: size }} role="status" aria-label="로딩 중" />
);
