import { SearchOutlined, BellOutlined, DownOutlined, MenuOutlined } from '@ant-design/icons';
import { Input, Avatar, Badge, Button } from 'antd';

interface TopbarProps {
    onMenuClick?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
    return (
        <div className="h-20 bg-admindashboardcolor px-4 md:px-8 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
            <div className="flex items-center">
                <Button
                    type="text"
                    icon={<MenuOutlined />}
                    className="mr-4"
                    onClick={onMenuClick}
                />
                {/* <h2 className="text-xl md:text-2xl font-bold text-gray-800 font-poppins">Dashboard</h2> */}
            </div>

            <div className="flex items-center space-x-4">
                {/* <Input
                    prefix={<SearchOutlined className="text-blue-500" />}
                    placeholder="Search here..."
                    className="w-80 h-10 rounded-full border-none bg-white shadow-sm"
                /> */}

                <Badge >
                    <button className="p-2 bg-white rounded-lg shadow-sm text-orange-400 mr-3">
                        <BellOutlined style={{ fontSize: '20px' }} />
                    </button>
                </Badge>

                <div className="flex items-center space-x-3">
                    <Avatar src="https://i.pravatar.cc/150?img=12" size="large" />
                    <div className="hidden lg:block ml-2 ">
                        <p className="text-sm font-bold text-gray-800 leading-none">Admin</p>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                    <DownOutlined className="text-xs text-gray-400" />
                </div>
            </div>
        </div>
    );
};
