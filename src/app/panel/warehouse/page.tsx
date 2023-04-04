"use client";
import { WarehouseAusgangForm } from "@/components/WarehouseAusgangForm";
import { WarehouseCard } from "@/components/WarehouseCard";
import { WarehouseEingangForm } from "@/components/WarehouseEingangForm";
import { useAuth } from "@/context/AuthContext";
import { warehouses } from "@/data/parameters";
import useFetchWarehouse from "@/hooks/useFetchWarehouse";
import { Warehouse } from "@/types/Warehouse";
import { exportExcel } from "@/utils/exportExcel";
import { getUniqueSupplierPartNumber } from "@/utils/getUniqueSupplierPartNumber";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WarehousePage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const { warehouse, loading, error } = useFetchWarehouse();
  const [getFilter, setGetFilter] = useState<string>("");
  const [warehouseItems, setWarehouseItems] = useState<Warehouse[]>();
  const [warehouseTotalItems, setWarehouseTotalItems] = useState<Warehouse[]>();
  const [limitWarehouse, setLimitWarehouse] = useState<number>(5);
  const [showEingangPopUp, setShowEigangPopUp] = useState<boolean>(false);
  const [showAusgangPopUp, setShowAusgangPopUp] = useState<boolean>(false);

  // to validate screens
  useEffect(() => {
    if (!userProfile) return;

    const validateScreen = !!userProfile.screens.find(
      (screen: string) => screen === "warehouse" || screen === "admin"
    );

    if (!validateScreen) {
      alert("Sie haben keinen Zugriff auf den Bildschirm");
      return router.push("panel");
    }
  }, [userProfile]);

  // to filter the items
  useEffect(() => {
    if (!warehouse) return;
    if (!getFilter) {
      setWarehouseTotalItems(warehouse);
      return setWarehouseItems(warehouse.slice(0, limitWarehouse));
    }

    const filteredWarehouseItems = warehouse.filter((item) =>
      item.supplierPartNumber.includes(getFilter)
    );
    setWarehouseItems(filteredWarehouseItems.slice(0, limitWarehouse));
    setWarehouseTotalItems(filteredWarehouseItems);
  }, [warehouse, getFilter, limitWarehouse]);

  // filter the quantity by warehouse
  const filterQuantityByWarehouse = (warehouse: string) => {
    if (!warehouseTotalItems) return;
    const filteredQuantity: number[] = warehouseTotalItems.map((item) => {
      if (item.warehouse === warehouse) return item.quantity;
      return 0;
    });
    return filteredQuantity;
  };

  return (
    <>
      {/* WarehouseForm */}
      {!showEingangPopUp ? null : (
        <WarehouseEingangForm setShowPopUp={setShowEigangPopUp} />
      )}
      {!showAusgangPopUp ? null : (
        <WarehouseAusgangForm setShowPopUp={setShowAusgangPopUp} />
      )}
      {/* Header */}
      <section className="section">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4 items-center">
            {/* Title */}
            <div>
              <h1 className="h1">Warehouse Bildschrim</h1>
            </div>
            {/* Search and Button Area */}
            <div className="flex flex-col gap-4 items-center">
              {/* Button */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowEigangPopUp(true)}
                  className="btn btn-sm bg-green-500 hover:bg-green-900"
                >
                  Eingang
                </button>
                <button
                  onClick={() => setShowAusgangPopUp(true)}
                  className="btn btn-sm bg-red-500 hover:bg-red-900"
                >
                  Ausgang
                </button>
                <button
                  className="text-xl"
                  onClick={() =>
                    exportExcel(warehouse, "warehouse_data", "warehouse")
                  }
                >
                  📄
                </button>
              </div>
              {/* Search */}
              <div className="flex flex-col gap-2 items-center justify-center">
                <span className="text-sm">🔎 Bestellnummer</span>
                <select
                  value={getFilter}
                  className="px-4 py-1 rounded-lg text-black"
                  placeholder="🔎 Bestellnummer"
                  onChange={(e) => setGetFilter(e.target.value.toUpperCase())}
                >
                  <option value=""></option>
                  {!warehouse
                    ? null
                    : getUniqueSupplierPartNumber(warehouse).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Material stock */}
      <section className="section">
        <div className="container mx-auto">
          {/* List of warehouses and quantities */}
          <div className="flex flex-col lg:flex-row gap-4 ">
            {/* List of warehouses */}
            <div className="self-center lg:self-start p-4 bg-gray-800 rounded-lg grid grid-cols-2 lg:grid-cols-1 gap-x-8">
              <div>
                <span className="font-semibold text-[#F28B00]">
                  Eingabemenge:{" "}
                </span>
                <span>
                  {warehouseTotalItems
                    ?.map((warehouse) => warehouse.quantity)
                    .reduce((a, b) => a + b)}{" "}
                  Stck
                </span>
              </div>
              {warehouses.map((item) => (
                <div key={item}>
                  <span className="font-semibold">{item}: </span>
                  <span>
                    {filterQuantityByWarehouse(item)?.reduce((a, b) => a + b)}{" "}
                    Stck
                  </span>
                </div>
              ))}
            </div>
            {/* WarehouseCard */}
            {loading && (
              <div className="flex flex-1 justify-center">
                <span>Wird geladen...</span>
              </div>
            )}
            {/* error / 0 anfragen*/}
            {error && (
              <div className="flex flex-1 items-center">
                <span>{error}</span>
              </div>
            )}
            {/* inbound and outboud cards */}
            {!loading && warehouse && (
              <div className="flex flex-1 flex-col gap-4">
                {warehouseItems?.map((item) => (
                  <article key={item.id}>
                    <WarehouseCard warehouse={item} />
                  </article>
                ))}
                <div className="self-center">
                  {warehouseItems?.length &&
                  warehouseItems.length < limitWarehouse ? null : (
                    <button
                      className="btn btn-lg"
                      onClick={() => setLimitWarehouse(limitWarehouse + 5)}
                    >
                      Mehr
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
