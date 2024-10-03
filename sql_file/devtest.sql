-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 03, 2024 at 07:19 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `devtest`
--

-- --------------------------------------------------------

--
-- Table structure for table `lccbmerchandise`
--

CREATE TABLE `lccbmerchandise` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lccbmerchandise`
--

INSERT INTO `lccbmerchandise` (`id`, `name`, `price`) VALUES
(1, 'Jacket', 750.00),
(2, 'Baseball Cap', 250.00),
(3, 'T-Shirt', 250.00);

-- --------------------------------------------------------

--
-- Table structure for table `schoolsupplies`
--

CREATE TABLE `schoolsupplies` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `schoolsupplies`
--

INSERT INTO `schoolsupplies` (`id`, `name`, `price`) VALUES
(1, 'Yellow Pad', 75.00),
(2, 'Intermediate Pad', 75.00),
(3, 'Eraser', 20.00);

-- --------------------------------------------------------

--
-- Table structure for table `tb_logins`
--

CREATE TABLE `tb_logins` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_logins`
--

INSERT INTO `tb_logins` (`id`, `email`, `password`) VALUES
(7, 'admin@gmail.com', '123'),
(8, '09xghagox09@gmail.com', '123');

-- --------------------------------------------------------

--
-- Table structure for table `uniforms`
--

CREATE TABLE `uniforms` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `uniforms`
--

INSERT INTO `uniforms` (`id`, `name`, `price`) VALUES
(1, 'SBIT Departmental Shirt', 500.00),
(2, 'SHTM Departmental Shirt', 550.00),
(3, 'SSLATE Departmental Shirt', 750.00),
(4, 'tae', 1.00);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `lccbmerchandise`
--
ALTER TABLE `lccbmerchandise`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `schoolsupplies`
--
ALTER TABLE `schoolsupplies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_logins`
--
ALTER TABLE `tb_logins`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `uniforms`
--
ALTER TABLE `uniforms`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `lccbmerchandise`
--
ALTER TABLE `lccbmerchandise`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `schoolsupplies`
--
ALTER TABLE `schoolsupplies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tb_logins`
--
ALTER TABLE `tb_logins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `uniforms`
--
ALTER TABLE `uniforms`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
