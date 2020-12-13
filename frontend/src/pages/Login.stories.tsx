import { Story, Meta } from '@storybook/react/types-6-0';
import { MemoryRouter } from 'react-router';

import { Login, LoginProps } from './Login';

export default {
    title: 'pages/Login',
    component: Login,
    decorators: [story => <MemoryRouter>{story()}</MemoryRouter>]
} as Meta;

const Template: Story<LoginProps> = (args) => <Login {...args} />;

export const Default = Template.bind({});
