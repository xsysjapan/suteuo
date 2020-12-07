import { Col, Container, Row } from 'reactstrap';
import LoginForm, { LoginFormProps } from '../components/LoginForm';

export type LoginProps = {
    onSubmit: LoginFormProps['onSubmit']
}

export const Login = (props: LoginProps) => {
    const { onSubmit } = props
    return (
        <Container>
            <h1>ログイン</h1>
            <Row>
                <Col md="6">
                    <LoginForm onSubmit={onSubmit} />
                </Col>
            </Row>
        </Container>
    )
};

export default Login;