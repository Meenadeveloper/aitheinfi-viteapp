import React from "react";
import BreadCrumb from "../../../../Common/BreadCrumb";


const FormWizard = () => {
    return (
        <React.Fragment>
            <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
                <BreadCrumb title="Register Wizard" pageTitle="Wizards" />

                <div className="grid grid-cols-1 2xl:grid-cols-12">
                    <div className="col-span-12 2xl:col-start-3 2xl:col-span-8">
                        <div className="card">
                            <div className="card-body">
                              

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment >
    );
}

export default FormWizard;