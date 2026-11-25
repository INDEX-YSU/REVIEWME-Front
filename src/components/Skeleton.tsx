import styles from './Skeleton.module.css';

type SkeletonLineProps = {
  width?: string;
};

export const SkeletonLine = ({ width = '100%' }: SkeletonLineProps) => (
  <span className={styles.line} style={{ width }} />
);
