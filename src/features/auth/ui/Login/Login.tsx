import {selectThemeMode, setIsLoggedInAC} from "@/app/app-slice"
import {useAppDispatch, useAppSelector} from "@/common/hooks"
import {getTheme} from "@/common/theme"
import {LoginInputs, loginSchema} from "@/features/auth/lib/schemas"
import {zodResolver} from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import {Controller, type SubmitHandler, useForm} from "react-hook-form"
import styles from "./Login.module.css"
import {useLazyGetCaptchaQuery, useLoginMutation} from "@/features/todolists/api/authApi.ts";
import {ResultCode} from "@/common/enums";
import {AUTH_TOKEN} from "@/common/constants";
import {useState} from "react";
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const Login = () => {
    const themeMode = useAppSelector(selectThemeMode)
    const dispatch = useAppDispatch()
    const theme = getTheme(themeMode)

    const [login] = useLoginMutation()
    const [getCaptcha] = useLazyGetCaptchaQuery()
    const [captchaUrl, setCaptchaUrl] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<LoginInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "Kim_752@mail.ru",
            password: "",
            rememberMe: false,
            captcha: ""
        }
    });
    const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
        const res = await login(data).unwrap()

        if (res.resultCode === 10) {
            const captchaRes = await getCaptcha().unwrap()
            setCaptchaUrl(captchaRes.url)
            return
        }

        if (res.resultCode === ResultCode.Success) {
            localStorage.setItem(AUTH_TOKEN, res.data.token)
            dispatch(setIsLoggedInAC({isLoggedIn: true}))
            reset()
        }
    }

    return (
        <Grid container justifyContent={"center"}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl>
                    <FormLabel>
                        <p>
                            To login get registered
                            <a
                                style={{color: theme.palette.primary.main, marginLeft: "5px"}}
                                href="https://social-network.samuraijs.com"
                                target="_blank"
                                rel="noreferrer"
                            >
                                here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>
                            <b>Email:</b> free@samuraijs.com
                        </p>
                        <p>
                            <b>Password:</b> free
                        </p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                            label="Email"
                            margin="normal"
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register("email")}
                        />
                        {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                        <TextField
                            type={showPassword ? "text" : "password"}
                            label="Password"
                            margin="normal"
                            error={!!errors.password}
                            {...register("password")}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                        {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}
                        <FormControlLabel
                            label={"Remember me"}
                            control={
                                <Controller
                                    name="rememberMe"
                                    control={control}
                                    render={({field: {value, ...field}}) => <Checkbox {...field} checked={value}/>}
                                />
                            }
                        />
                        <Button type="submit" variant="contained" color="primary">
                            Login
                        </Button>

                    </FormGroup>
                    {captchaUrl && (
                        <>
                            <img src={captchaUrl} alt="captcha"/>
                            <TextField label="Captcha" margin="normal" {...register("captcha")} />
                        </>
                    )}
                </FormControl>
            </form>
        </Grid>
    )
}

