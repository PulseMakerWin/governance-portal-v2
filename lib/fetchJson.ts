/*

SPDX-FileCopyrightText: © 2023 Dai Foundation <www.daifoundation.org>

SPDX-License-Identifier: AGPL-3.0-or-later

*/

export async function fetchJson(url: string, init?: RequestInit): Promise<any> {
  const baseUrl = process.env.BASE_URL || 'https://pulsemaker.win';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  const response = await fetch(fullUrl, init);
  const json = await response.json();

  if (!response.ok) {
    return Promise.reject({
      status: response.status,
      statusText: response.statusText,
      json,
      message: json?.error && json.error.message ? json.error.message : 'Request failed'
    });
  }
  return json;
}
