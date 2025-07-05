import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import style from './style.module.css';
import { ReactComponent as EmailIcon } from '../../../assets/Icons/login/Email Address.svg';
import { ReactComponent as SMSIcon } from '../../../assets/Icons/login/SMS.svg';

type MFAProps = {
  handleMFAMethod: (method: string) => void;
  selectedMFAMethod: MFAMethod;
  setSelectedMFAMethod: (method: MFAMethod) => void;
};

type MFAMethod = 'email' | 'phone';

const mfaValidation = Yup.object().shape({
  method: Yup.string()
    .oneOf(['email', 'phone'] as const, 'Please select a valid verification method')
    .required('Please select a verification method'),
});

type MFAFormInputs = {
  method: MFAMethod;
};

const MFA = (props: MFAProps) => {
  const {
    setValue,
    formState: { errors },
  } = useForm<MFAFormInputs>({
    resolver: yupResolver(mfaValidation),
    defaultValues: {
      method: 'email',
    },
  });

  const handleMethodSelect = (method: MFAMethod) => {
    // if (method === 'phone') return; // Prevent SMS selection
    props.setSelectedMFAMethod(method);
    setValue('method', method);

    props.handleMFAMethod(method);
    return method;
  };

  return (
    <div className={style.mfaOptionsContainer}>
      <div
        className={`${style.mfaOption} ${props.selectedMFAMethod === 'email' ? style.selected : ''}`}
        onClick={() => handleMethodSelect('email')}
        role="button"
        tabIndex={0}
      >
        <div className={style.iconWrapper}>
          <EmailIcon height={24} width={24} className={style.mfaIcon} />
        </div>
        <h2>Email</h2>
        <p>Login with email verification code.</p>
      </div>

      <div
        className={`${style.mfaOption} ${props.selectedMFAMethod === 'phone' ? style.selected : ''}`}
        onClick={() => handleMethodSelect('phone')}
        role="button"
        tabIndex={1}
      >
        <div className={style.iconWrapper}>
          <SMSIcon height={24} width={24} className={style.mfaIcon} />
        </div>
        <h2>SMS</h2>
        <p>Login with SMS verification code.</p>
      </div>
      {errors.method && <p className={style.error}>{errors.method.message}</p>}
    </div>
  );
};

export default MFA;
