<?php

	header('Content-Type: application/json');

	require_once 'util/curl_get_contents.inc.php';

	$maxrecords = 250;
	$order = 'asc';

	$username = $_GET['username'];
	$password = $_GET['password'];

	$params = array(
		'username' => $username,
		'password' => $password,
		'maxrecords' => $maxrecords,
		'order' => $order,
		'start' => $_GET['start'],
		'end' => $_GET['end'],
		'symbol' => $_GET['symbol'],
		'interval' => $_GET['interval']
	);


	$eod = false;

	// EOD data
	if ( in_array($_GET['interval'], array('daily', 'weekly', 'monthly')) ) {
		$params['data'] = $_GET['interval'];

		if ( isset($_GET['data']) ) {
			$params['data'] .= $_GET['data'];
		}

		$url_params = http_build_query($params);
		$eod = true;
		$url = 'http://ds01.ddfplus.com/historical/queryeod.ashx?' . $url_params;
		$map = array( 'symbol' => 0, 'time' => 1, 'open' => 2, 'high' => 3, 'low' => 4, 'close' => 5, 'volume' => 6, 'oi' => 7 );
	} else {
		$params['interval'] = str_replace('m', '', $params['interval']);
		$url_params = http_build_query($params);
		$url = 'http://ds01.ddfplus.com/historical/queryminutes.ashx?' . $url_params;
		$map = array( 'time' => 0, 'trading_day' => 1, 'open' => 2, 'high' => 3, 'low' => 4, 'close' => 5, 'volume' => 6 );
	}

	// * notation data returned is slightly different
	if ( strstr($_GET['symbol'], '*') && $eod === false ) {
		$map = array( 'name' => 0, 'time' => 1, 'trading_day' => 2, 'open' => 3, 'high' => 4, 'low' => 5, 'close' => 6, 'volume' => 7 );
	}

	$csv = curl_get_csv($url);

	if ( empty($csv) ) {
		exit( $_GET['callback'] . '(' . json_encode(array('error'=> true)) . ')' );
	}

	$return = $volume = $oi = array();
	$last_change = 0;

	foreach ($csv as $row => $values) {

		$return[] = array(
			strtotime( $values[ $map['time'] ] ) . '000',
			$values[ $map['open'] ],
			$values[ $map['high'] ],
			$values[ $map['low'] ],
			$values[ $map['close'] ]
		);

		$closeChg = $values[ $map['close'] ] - $last_change;
        if ($closeChg > 0) {
            $color = '#006600';
        } else if ($closeChg < 0) {
            $color = '#FF0000';
        } else {
            $color = '#000066';
        }

        $last_change = $values[ $map['close'] ];

		$volume[] = array(
			'x' => strtotime( $values[ $map['time'] ] ) . '000',
			'y' => $values[ $map['volume'] ],
			'color' => $color
		);

		// Add open interest if data is end-of-day
		if ($eod && isset($values[ $map['oi'] ]) ) {
			$oi[] = array(
				'x' => strtotime( $values[ $map['time'] ] ) . '000',
				'y' => $values[ $map['oi'] ],
			);
		}
	}

	$studies = array();

	if ( isset($_GET['studies']) ) {
		foreach ($_GET['studies'] as $study) {
			switch ($study) {
				case 'Trendspotter':
					$param = 'trend=y';
					break;
				default:
					break;
			}

			$study_url = $url . '&' . $param;
			$study_csv = curl_get_csv( $study_url );

			$studies[$study] = $study_csv;
		}
	}

	$start = $_GET['start'];
	$end = $_GET['end'];

	$events = array();

	if ( $_GET['dividends'] === 'true' || $_GET['splits'] === 'true' || $_GET['earnings'] === 'true' ) {

		$params = array(
			'username' => $username,
			'password' => $password,
			'symbols' => $_GET['symbol'],
			'start' => $_GET['start'],
			'end' => $_GET['end'],
			'splits' => $_GET['splits'],
			'dividends' => $_GET['dividends'],
			'earnings' => $_GET['earnings']
		);
		$url = 'http://ds01.ddfplus.com/historical/queryevents.ashx?' . http_build_query( $params );

		$csv = curl_get_csv( $url );

		if ( !empty($csv) ) {

			foreach ($csv as $row => $values) {
				switch ($values[2]) {
					case 'Earnings':
						$color = '#466300';
						break;
					case 'Split' :
						$color = '#dc7300';
						break;
					case 'Dividend':
					default:
						$color = '#6583ae';
						break;
				}

				$events[] = array(
					'title' => strtoupper( substr($values[2], 0, 1) ),
					'text' => $values[2] . ' ' . $values[3],
					'x' => strtotime($values[1]) . '000',
					'color' => $color
				);

			}
		}
	}

	echo $_GET['callback'] . '(' . json_encode(array('data'=> $return, 'volume' => $volume, 'oi' => $oi, 'events' => $events, 'name' => strtoupper($_GET['symbol']), 'start' => $start, 'end' => $end, 'studies' => $studies), JSON_NUMERIC_CHECK) . ')';

?>