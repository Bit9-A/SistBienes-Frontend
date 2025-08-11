import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { TfiMenu } from 'react-icons/tfi';
import {
  getDashboardCountsFurniture,
  DashboardCountsFurniture,
} from '../../../../api/DashboardApi';
import * as htmlToImage from 'html-to-image';
import React, { useEffect, useState } from 'react';

import Card from 'components/card/Card';

const estadoColors: Record<string, string> = {
  Nuevo: '#22c55e',
  Usado: '#f59e42',
  Dañado: '#ef4444',
};

const BarChart = () => {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgBar = useColorModeValue('gray.200', 'whiteAlpha.200');
  const [counts, setCounts] = useState<DashboardCountsFurniture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getDashboardCountsFurniture();
        setCounts(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
        setCounts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  if (loading) return <Text>Cargando...</Text>;

  const maxValue =
    counts.length > 0 ? Math.max(...counts.map((e) => Number(e.total))) : 1;

  const downloadPNG = async () => {
    const chartElement = document.getElementById('custom-barchart');
    if (!chartElement) return;

    await document.fonts.ready;

    htmlToImage
      .toPng(chartElement, {
        pixelRatio: 2,
        backgroundColor: 'white',
      })
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = 'barchart.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error al generar PNG:', err);
      });
  };

  const downloadSVG = async () => {
    const chartElement = document.getElementById('custom-barchart');
    if (!chartElement) return;

    await document.fonts.ready;

    htmlToImage
      .toSvg(chartElement)
      .then((dataUrl: string) => {
        const link = document.createElement('a');
        link.download = 'barchart.svg';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Error al generar SVG:', err);
      });
  };

  const downloadCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Estado,Total\n' +
      counts.map((e) => `${e.nombre},${e.total}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encodedUri;
    link.download = 'barchart.csv';
    link.click();
  };

  return (
    <Card p="24px" w="100%">
      {/* Toolbar personalizada */}
      <Flex justify="space-between" align="center" mb="4">
        <Box>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Resumen de Bienes
          </Text>
          <Text fontSize="sm" color="gray.500">
            Distribución por estado
          </Text>
        </Box>
        <Flex gap={2}>
          <Menu placement="left-start">
            <MenuButton
              as={IconButton}
              icon={<TfiMenu color="#6e8192" />}
              size="sm "
              variant="ghost"
              aria-label="Herramientas"
              minW="auto"
              h="24px"
              w="24px"
              p="0"
            />
            <MenuList
              bg="#fff"
              top="100%"
              border="1px solid #ddd"
              borderRadius="3px"
              p="3px"
              right="10px"
              minW="110px"
            >
              <MenuItem
                onClick={downloadSVG}
                fontSize="12px"
                color="#222"
                py="6px"
                px="14px"
                borderRadius="8px"
                _hover={{ bg: '#F4F7FE' }}
                fontWeight="normal"
              >
                Download SVG
              </MenuItem>

              <MenuItem
                onClick={downloadPNG}
                fontSize="12px"
                color="#222"
                py="6px"
                px="14px"
                borderRadius="8px"
                _hover={{ bg: '#F4F7FE' }}
                fontWeight="normal"
              >
                Download PNG
              </MenuItem>

              <MenuItem
                onClick={downloadCSV}
                fontSize="12px"
                color="#222"
                py="6px"
                px="14px"
                borderRadius="8px"
                _hover={{ bg: '#F4F7FE' }}
                fontWeight="normal"
              >
                Download CSV
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Box id="custom-barchart" bg="white" p="4" borderRadius="lg" w="full">
        {counts.map((estado) => (
          <Flex align="center" mb="4" key={estado.nombre}>
            <Box
              h="10px"
              w="10px"
              borderRadius="full"
              bg={estadoColors[estado.nombre] || '#888'}
              mr="2"
              style={{ color: '#222' }}
            />
            <Text
              fontWeight="600"
              fontSize="sm"
              color={textColor}
              minW="140px"
              mr="2"
            >
              {estado.nombre}
            </Text>
            <Box flex="1" mx="2">
              <Box
                h="8px"
                borderRadius="md"
                bg={bgBar}
                position="relative"
                overflow="hidden"
              >
                <Box
                  h="8px"
                  borderRadius="md"
                  bg={estadoColors[estado.nombre] || '#888'}
                  width={`${(Number(estado.total) / maxValue) * 100}%`}
                  transition="width 0.5s"
                  position="absolute"
                  top="0"
                  left="0"
                />
              </Box>
            </Box>
            <Text
              fontWeight="700"
              fontSize="sm"
              color={textColor}
              minW="32px"
              ml="2"
            >
              {estado.total}
            </Text>
          </Flex>
        ))}
      </Box>
    </Card>
  );
};

export default BarChart;
