"use client"

import type React from "react"
import { SimpleGrid, FormControl, FormLabel, Input, Textarea, Select } from "@chakra-ui/react"
import type {
    MovableAsset,
    MovableAssetGroup,
    MovableAssetCondition,
    MovableAssetLocation,
    Department,
} from "../variables/inventoryTypes"

interface AssetFormProps {
    asset: Partial<MovableAsset>
    groups: MovableAssetGroup[]
    conditions: MovableAssetCondition[]
    locations: MovableAssetLocation[]
    departments: Department[]
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export const AssetForm: React.FC<AssetFormProps> = ({
    asset,
    groups,
    conditions,
    locations,
    departments,
    onChange,
}) => {
    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
            <FormControl>
                <FormLabel>Serial</FormLabel>
                <Input name="numero_serial" value={asset.numero_serial || ""} onChange={onChange} placeholder="Serial" />
            </FormControl>
            <FormControl>
                <FormLabel>Nombre & Descripcion</FormLabel>
                <Textarea
                    name="descripcion"
                    value={asset.descripcion || ""}
                    onChange={onChange}
                    placeholder="Nombre & Descripcion"
                    resize="none"
                    rows={1}
                />
            </FormControl>

            <FormControl>
                <FormLabel>Marca</FormLabel>
                <Input name="marca" value={asset.marca || ""} onChange={onChange} placeholder="Marca" />
            </FormControl>
            <FormControl>
                <FormLabel>Modelo</FormLabel>
                <Input name="modelo" value={asset.modelo || ""} onChange={onChange} placeholder="Modelo" />
            </FormControl>
            <FormControl>
                <FormLabel>Cantidad</FormLabel>
                <Input name="cantidad" type="number" value={asset.cantidad || ""} onChange={onChange} placeholder="Cantidad" />
            </FormControl>
            <FormControl>
                <FormLabel>Valor Unitario</FormLabel>
                <Input
                    name="valor_unitario"
                    type="number"
                    step="0.01"
                    value={asset.valor_unitario || ""}
                    onChange={onChange}
                    placeholder="Valor Unitario"
                />
            </FormControl>
            <FormControl>
                <FormLabel>Departamento</FormLabel>
                <Select name="departamento" value={asset.departamento || ""} onChange={onChange} borderRadius="md">
                    <option value="">Departamento...</option>
                    {departments.map((department) => (
                        <option key={department.id} value={department.id}>
                            {department.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Seleccione Un Subgrupo</FormLabel>
                <Select name="subgrupo" value={asset.subgrupo || ""} onChange={onChange} borderRadius="md">
                    <option value="">Subgrupos...</option>
                    {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                            {group.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Condición del Bien</FormLabel>
                <Select name="id_estado" value={asset.id_estado || ""} onChange={onChange} borderRadius="md">
                    <option value="">Condición...</option>
                    {conditions.map((condition) => (
                        <option key={condition.id} value={condition.id}>
                            {condition.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>Parroquia Perteneciente</FormLabel>
                <Select name="id_Parroquia" value={asset.id_Parroquia || ""} onChange={onChange} borderRadius="md">
                    <option value="">Parroquia...</option>
                    {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                            {location.name}
                        </option>
                    ))}
                </Select>
            </FormControl>
        </SimpleGrid>
    )
}
