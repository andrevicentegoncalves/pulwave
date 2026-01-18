import { Tabs, TabPanel } from "@pulwave/ui";
import IconLibraryPage from '../IconLibraryPage/IconLibraryPage';
import { IconGuidelinesPage } from '../IconGuidelinesPage/IconGuidelinesPage';

const IconLibraryShell = () => {
    return (
        <div className="w-full">
            <Tabs defaultTab={0} className="w-full">
                <TabPanel label="Library">
                    <div className="mt-8">
                        <IconLibraryPage />
                    </div>
                </TabPanel>
                <TabPanel label="Usage & Guidelines">
                    <div className="mt-8">
                        <IconGuidelinesPage />
                    </div>
                </TabPanel>
            </Tabs>
        </div>
    );
};

export default IconLibraryShell;
