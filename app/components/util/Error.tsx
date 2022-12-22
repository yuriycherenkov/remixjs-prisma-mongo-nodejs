import { FaExclamationCircle } from 'react-icons/fa';
import type { IError } from './interfaces';

function Error({ title, children }: IError) {
  return (
    <div className="error">
      <div className="icon">
        <FaExclamationCircle />
      </div>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export default Error;
