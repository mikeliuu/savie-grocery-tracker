import React from "react";
import MenuLayout from "@/layouts/menu-layout";
import { useGetUserInfoQuery } from "@/redux/services/userApi";
import UserProfileCard from "@/components/user-profile-card";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icon";
import AppRoutes from "@/lib/routes";
import { Card } from "@/components/ui/card";
import disclaimerDoc from "@/lib/docs/disclaimer.json";
import BackActionMenuLayout from "@/layouts/back-action-menu-layout";

export default function Disclaimer() {
  const docList = [
    {
      title: "Data Collection And Usage:",
      list: disclaimerDoc?.dataCollectionAndUsage,
    },
    {
      title: "Data Protection And Security:",
      list: disclaimerDoc?.dataProtectionAndSecurity,
    },
    {
      title: "User Rights:",
      list: disclaimerDoc?.userRights,
    },
    {
      title: "Cookies and Tracking Technologies:",
      list: disclaimerDoc?.cookiesAndTrackingTechnologies,
    },
    {
      title: "Third-Party Links:",
      list: disclaimerDoc?.thirdPartyLinks,
    },
    {
      title: "Changes to this Disclaimer:",
      list: disclaimerDoc?.changesToDisclaimer,
    },
  ];

  return (
    <BackActionMenuLayout heading="Disclaimer">
      <Card size="initial" variant="static" className="p-4 bg-gray-100">
        <h4 className="mb-4 text-xl font-medium text-gray-900">
          Disclaimer: {disclaimerDoc?.disclaimer}
        </h4>

        <ol className="space-y-4 list-decimal list-inside">
          {docList?.map((docItem, docIndex) => {
            return (
              <li key={docIndex}>
                <p className="text-gray-900">{docItem?.title}</p>

                <ul className="pl-5 mt-2 space-y-1 list-disc list-inside">
                  {docItem?.list?.map((item, index) => {
                    return (
                      <li
                        key={`${docItem.title}-${index}`}
                        className="text-gray-900"
                      >
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>

        {/* <ol className="list-decimal">
          {disclaimerDoc?.dataProtectionAndSecurity?.map((item, index) => {
            return <li key={`dataCollectionAndUsage-${index}`}>{item}</li>;
          })}
        </ol>
        <ol className="list-decimal">
          {disclaimerDoc?.userRights?.map((item, index) => {
            return <li key={`dataCollectionAndUsage-${index}`}>{item}</li>;
          })}
        </ol>
        <ol className="list-decimal">
          {disclaimerDoc?.cookiesAndTrackingTechnologies?.map((item, index) => {
            return <li key={`dataCollectionAndUsage-${index}`}>{item}</li>;
          })}
        </ol>
        <ol className="list-decimal">
          {disclaimerDoc?.thirdPartyLinks?.map((item, index) => {
            return <li key={`dataCollectionAndUsage-${index}`}>{item}</li>;
          })}
        </ol>
        <ul className="list-decimal">
          {disclaimerDoc?.changesToDisclaimer?.map((item, index) => {
            return <li key={`dataCollectionAndUsage-${index}`}>{item}</li>;
          })}
        </ul> */}

        <p className="text-gray-900 mt-4">{disclaimerDoc?.acknowledgement}</p>
      </Card>

      {/* <div className="grid grid-cols-1 gap-5">
        <UserProfileCard className="mb-2" loading={isLoading} data={data} />

        <ul className="shadow max-w-full-lg text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg   ">
          {profileList?.map((menu, index) => {
            const menuClass =
              "w-full p-4 font-medium text-sm flex items-center jusitfy-between cursor-pointer border-b border-gray-200 rounded-t-lg  hover:bg-gray-100";

            return (
              <li key={index} className="flex">
                <Link to={menu?.to!} className={menuClass}>
                  {menu?.label}

                  <Icons.chevronRight className="text-gray-500 ml-auto" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div> */}
    </BackActionMenuLayout>
  );
}
