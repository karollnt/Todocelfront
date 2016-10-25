" Use strict ' ;
la función  de inicio de sesión () {
	var usr =  documento . querySelector ( ' Js-Usuario " ). Valor ;
	si (usr ! = ' ' ) {
		var clave =  documento . querySelector ( ' Js-Clave ' ). valor ;
		Clave =  MD5 (clave);
		$ . Ajax ({
			Tipo :  " poste " ,
			url : waooserver + " / Sesiones / inicio de sesión " ,
			tipoDatos :  " json " ,
			Datos : {nick : usr, clave : clave},
			el éxito :  la función ( resp ) {
				si ( resp . msg  ==  " ok " ) {
					$ ( " #loginimg " .) Prop ( " src " , " images / icons / azul / logout.png " );
					$ ( " #loginsp " ). Html ( " Cerrar sesion y oacute; n " );
					myApp . closeModal ( ' .popup-login ' );
					var NCK =  $ ( " entrada #LoginForm [name = 'nick'] " ). val ();
					$ ( " #LoginForm " ) [ 0 ]. Restablecer ();
					ventana . localStorage . setItem ( " nick " , NCK);
					$ ( " #loginimg " ). Progenitor (). Desenlazar ( ' clic ' );
					$ ( " #loginimg " ). Progenitor (). Bind ( ' clic ' , la función () { Salir ();});
					$ ( " #snck " ). Html (NCK);
					cambiaIconosAsesor (NCK);
					contarNotificacionesSinLeer ();
					tareanotificaciones =  setInterval ( función () { contarNotificacionesSinLeer ();}, 60000 );
					colocarAvatar ( ' .user_avatar img ' );
					verificaRedirect (NCK);
					actualizarToken ();
				}
				otra  alerta ( resp . msg );
			},
			Error :  la función ( e ) {
				alerta ( " Error: '  +  e . mensaje );
			}
		});
	}
	otra cosa {
		alerta ( " Escribá ONU Nombre de usuario " );
	}
}

la función  de cierre de sesión () {
	ventana . localStorage . removeItem ( " nick " );
	$ ( " #loginimg " .) Prop ( " src " , " images / icons / azul / user.png " );
	$ ( " #loginsp " ). Html ( " Iniciar sesion y oacute; n " );
	myApp . emergente ( " .popup-login " );
	$ ( " #loginimg " ). Progenitor (). Bind ( ' clic ' , la función () { myApp . Emergente ( " .popup-login " );});
	clearInterval (tareanotificaciones);
	tareanotificaciones =  nula ;
	$ ( " #snck " ). Html ( " - " );
}

función de  registro () {
	var Datos =  $ ( " #RegisterForm " .) serializar ();
	$ . Ajax ({
		Tipo :  " poste " ,
		url : waooserver + " / Usuarios / crearUsuario " ,
		tipoDatos :  " json " ,
		datos : Datos,
		el éxito :  la función ( resp ) {
			alerta ( resp . msg );
			$ ( " #RegisterForm " ) [ 0 ]. Restablecer ();
			misendbird . PreInit ( $ ( ' Js-user-reg ' ). val ());
			ubicación . href  =  ' index.html ' ;
		},
		Error :  la función ( e ) {
			alerta ( " Error: '  +  e . mensaje );
		}
	});
}

función  register2 () {
	var Datos =  $ ( " # RegisterForm2 " ). serializar ();
	$ . Ajax ({
		Tipo :  " poste " ,
		url : waooserver + " / Usuarios / crearUsuario " ,
		tipoDatos :  " json " ,
		datos : Datos,
		el éxito :  la función ( resp ) {
			alerta ( resp . msg );
			$ ( " # RegisterForm2 " ) [ 0 ]. Restablecer ();
			misendbird . PreInit ( $ ( ' Js-asistente-reg ' ). val ());
			ubicación . href  =  ' index.html ' ;
		},
		Error :  la función ( e ) {
			alerta ( " Error: '  +  e . mensaje );
		}
	});
}

funcionar  verificarLog () {
	var loggedin =  ventana . localStorage . getItem ( " nick " );
	si (loggedin) volver  verdadera ;
	otra cosa  volver  falsa ;
}

función  verificaRedirect ( apodo ) {
	$ . Ajax ({
		Tipo :  " poste " ,
		url : waooserver + " / Usuarios / tipoUsuario " ,
		tipoDatos :  " json " ,
		Datos : {nick : nick},
		el éxito :  la función ( resp ) {
			si ( resp . de error ) de alerta ( " Error: '  +  resp . de error );
			otra cosa  si ( resp . tipo == 1 ) {
				cargaPagina ( ' data / crearsolicitud.html ' , 2 );
				misendbird . PreInit (apodo);
			}
			otra cosa {
				cargaPagina ( ' index.html ' , 0 );
				setTimeout ( función () {
					misendbird . init ( 0 );
					misendbird . setChannel ( ' ' );
					misendbird . setAssistant (apodo);
					misendbird . obtenerDireccionCanalChat ();
				}, 1000 );
			}
		},
		Error :  la función ( e ) {
			alerta ( " Error: '  +  e . mensaje );
		}
	});
}

función  verificaRedirect2 ( apodo ) {
	si (apodo) {
		$ . Ajax ({
			Tipo :  " poste " ,
			url : waooserver + " / Usuarios / tipoUsuario " ,
			tipoDatos :  " json " ,
			Datos : {nick : nick},
			el éxito :  la función ( resp ) {
				si ( resp . de error ) de alerta ( " Error: '  +  resp . de error );
				otra cosa  si ( resp . tipo == 1 ) {
					$ ( ' Js-recarga ' ). RemoveClass ( ' ocultos ' );
				}
				otra cosa {
					$ ( ' Js-recarga ' ). AddClass ( ' escondido ' );
				}
			},
			Error :  la función ( e ) {
				alerta ( " Error: '  +  e . mensaje );
			}
		});
	}
}

función  cambiaIconosAsesor ( apodo ) {
	si (apodo) {
		$ . Ajax ({
			Tipo :  " poste " ,
			url : waooserver + " / Usuarios / tipoUsuario " ,
			tipoDatos :  " json " ,
			Datos : {nick : nick},
			el éxito :  la función ( resp ) {
				si ( resp . de error ) de alerta ( " Error: '  +  resp . de error );
				otra cosa {
					si ( resp . tipo == 2 ) {
						$ ( ' Js-asistencia-historia ' ). RemoveClass ( ' escondido ' );
						$ ( " #crsolspn " ). Html ( " Solicitudes Libres " );
					}
					otra cosa  si ( resp . tipo == 1 ) {
						$ ( " #crsolspn " ). Html ( " Crear Solicitud " );
						$ ( ' Js-asistencia-historia ' .) AddClass ( ' escondido ' );
					}
				}
			},
			Error :  la función ( e ) {
				alerta ( " Error: '  +  e . mensaje );
			}
		});
	}
	otra cosa {
		verifcarga ();
	}
}

función  cargarBancoSelect ( ID ) {
	$ ( " # " + Id). Html ( ' ' );
	$ . Ajax ({
		Tipo :  " poste " ,
		url : waooserver + " / Bancos / listaBancos " ,
		tipoDatos :  " json " ,
		datos :  " " ,
		el éxito :  la función ( resp ) {
			si ( resp . de error ) $ ( " # " + id). append ( " <option value =" 0 "> " + resp . de error + " </ option> " );
			otra cosa {
				$ . Cada uno ( resp . Bancos , la función ( i , v ) {
					$ ( " # " + Id). Append ( " <option value = ' " + v . Identificación + " '> " + v . Nombre + " </ option> " );
				});
			}
		},
		Error :  la función ( e ) {
			alerta ( " Error al conectar Presentación: '  +  e . mensaje );
		}
	});
}

función  listaChecksMateria ( ID ) {
	$ ( " # " + Id). Html ( ' Buscando ' );
	$ . Ajax ({
		Tipo :  " poste " ,
		url : waooserver + " / Materias / listarMaterias " ,
		tipoDatos :  " json " ,
		datos :  " " ,
		el éxito :  la función ( resp ) {
			si ( resp . de error ) $ ( " # " + id). html ( " <div class = 'alerta alerta de peligro"> " + resp . de error + " </ div> " );
			otra cosa {
				$ ( " # " + Id). Html ( " <table id = 'tmatsreg' class = 'table-condensado mesa"> <caption> <b> Materias en las Que Participar y aacute; s </ b> </ caption> < / table> " );
				var colrwn =  " " ;
				var , reglas =  resp . Materias . de longitud ;
				var regsf =  3 ;
				$ . Cada uno ( resp . Materias , la función ( i , v ) {
					si (i == 0  || i % regsf == 0 ) {
						si (i > 0 ) colrwn + =  " </ tr> " ;
						colrwn + =  " <tr> " ;
					}
					colrwn + =  " <td> <= clase de etiqueta 'casilla de verificación-etiqueta del elemento de contenido' style = 'display: inline;"> "
						+ " <Input type =" checkbox "id =" mat_ " + i + " "name = 'mat_ " + i + " ' value = ' " + v . Identificación + " "> "
						+ " <Div class =" elemento-media '> "
							+ " <I class =" icon-form-casilla de verificación "> </ i> "
						+ " </ Div> "
						+ " <Div class =" item-interior "> "
                              + " <Div class = 'tema-título"> " + v . Nombre + " </ div> "
						+ " </ Div> "
					+ " </ Label> </ td> " ;
					si (i > = ( resp . Materias . de longitud - 1 )) {
						si (regs % regsf > 0 ) {
							var fil =  Math . redonda (regs / regsf);
							var resto = (fil * regsf) - , reglas;
							para ( var i1 = 0 ; i1 < reposo; i1 ++ ) {
								colrwn + =  " <td> </ td> " ;
							}
						}
						colrwn + =  " </ tr> " ;
					}
				});
				$ ( " #cantmatsreg " ). Val (reg);
				$ ( " #tmatsreg " .) Anexar (colrwn);
			}
		},
		Error :  la función ( e ) {
			$ ( " # " + Id). Html ( " <div class = 'alerta alerta de peligro"> Error al conectar Presentación: " + e . Mensaje + " </ div> " );
		}
	});
}

función  contarNotificacionesSinLeer () {
	var apodo =  ventana . localStorage . getItem ( " nick " );
	$ . Ajax ({
		Tipo :  " poste " ,
		url : waooserver + " / Usuarios / notificacionesNoLeidasCant " ,
		tipoDatos :  " json " ,
		Datos : {nick : nick},
		el éxito :  la función ( resp ) {
			si ( resp . de error ) de alerta ( " Error: '  +  resp . de error );
			otra cosa {
				$ ( " #notifcounter " ). Html ( resp . Msg );
			}
		},
		Error :  la función ( e ) {
			alerta ( " Error al conectar Presentación: '  +  e . mensaje );
		}
	});
}

función  listarNotificacionesSinLeer () {
	var apodo =  ventana . localStorage . getItem ( " nick " );
	var iddiv =  " listanotificaciones " ;
	$ ( " # " + Iddiv). Html ( " " );
	$ . Ajax ({
		Tipo :  " poste " ,
		url : waooserver + " / Usuarios / notificacionesNoLeidas " ,
		tipoDatos :  " json " ,
		Datos : {nick : nick},
		el éxito :  la función ( resp ) {
			si ( resp . de error ) de alerta ( " Error: '  +  resp . de error );
			otra cosa {
				$ ( " # " + Iddiv). Html ( " <ul class =" posts "> </ ul> " );
				si ( resp . msg == " No se encontraron Resultados " ) {
					$ ( " # " + Iddiv). Html ( " <div class = 'alerta alerta de peligro"> " + resp . Msg + " </ div> " );
				}
				var json =  JSON . analizar ( ' [ ' + resp . msg + ' ] ' );
				$ . Cada uno (JSON, la función ( i2 , v ) {
					var SPL1 = ( v . Fecha ). división ( "  " );
					var SPL2 = SPL1 [ 0 ]. división ( " - " );
					$ ( " # " + Iddiv + " UL " ). Append ( " <li> "
						+ " <Div class = 'posición: inicial importante;' 'post_entry' style => "
							+ " <Div class = 'posición: inicial importante;' 'post_date' style => "
								+ " <br> <Span class =" mes "> " + SPL2 [ 0 ] + " - " + SPL2 [ 1 ] + " <span> "
								+ " <Span class =" día "> " + SPL2 [ 2 ] + " <span> "
							+ " </ Div> "
							+ " <Div class = 'posición: inicial importante;' 'POST_TITLE' style => "
								+ " <H2> "
									+ (( V . Titulo ). Longitud > 18 ? ( V . Titulo ). Substr ( 0 , 15 ) + " ... " : v . Titulo )
								+ " </ H2> "
								+ " " + V . Mensaje + " <br> "
								+ ( V . Tipo == 1 ?
									" Botón <class = 'btn btn-primaria BTN-block' onclick = 'marcarLeida ( " + v . Identificación + " , " + v . Idtrabajo + " );"> Ver </ botón> Ofertas "
									: " <Botón class = 'btn btn-primaria BTN-block' onclick = 'verModalSolicitud ( " + v . Idtrabajo + " , 1);"> Ver Detalles </ botón> " )
							+ " </ Div> "
						+ " </ Div> "
					+ " </ Li> " );
				});
			}
		},
		Error :  la función ( e ) {
			$ ( " # " + Iddiv). Html ( " Error al conectar Presentación: " + e . Mensaje );
		}
	});
}

función  marcarLeida ( Identificación , idtrabajo ) {
	ventanaOfertas (idtrabajo);
}

funcionar  cargarDatosUsuario () {
	var apodo =  ventana . localStorage . getItem ( " nick " );
	$ ( " #dtcnt " ). Ocultar ();
	cargarBancoSelect ( " banct " );
	$ ( " #ncks " ). Val (apodo);
	$ ( ' #formupdate ' ). En ( ' enviar ' , la función ( e ) {
		e . preventDefault ();
		modificarUsuario ();
		volver  falsa ;
	});
	$ . Ajax ({
		Tipo :  ' palo ' ,
		url : waooserver + " / Usuarios / datosUsuario " ,
		tipoDatos :  " json " ,
		Datos : {nick : nick},
		el éxito  :  la función ( resp ) {
			var usr =  resp . Usuarios ;
			$ . Cada uno (usr, la función ( i2 , v ) {
				$ ( " # Tab1 .contactform entrada [name = 'nombre'] " ). Val ( v . Nombre );
				$ ( " # Tab1 .contactform entrada [name = 'Apellido'] " ). Val ( v . Apellido );
				colocarAvatar ( " # perfil-img " );
				si ( v . tipo == 2 ) {
					$ ( " #dtcnt " ). Espectáculo ();
					$ ( " #numct " ). Val ( v . Numerocuenta );
					$ ( " #banct " ). Val ( v . Idbanco );
				}
			});
		},
		Error :  la función ( e ) {
			alerta ( " Error al conectar Presentación: " + e . mensaje );
		}
	});
}

función  cambiarClave () {
	var CL1 =  $ . recortar ( $ ( " # Sep2 entrada [name = 'clave1'] " ). val ());
	var Cl2 =  $ . recortar ( $ ( " # Sep2 entrada [name = 'clave2'] " ). val ());
	si (CL1 ! = " "  && Cl2 ! = " " ) {
		si (CL1 == Cl2) {
			var apodo =  ventana . localStorage . getItem ( " nick " );
			$ . Ajax ({
				Tipo :  ' palo ' ,
				url : waooserver + " / Usuarios / actualizaClave " ,
				tipoDatos :  " json " ,
				Datos : {nick : apodo, clave : Cl2},
				el éxito  :  la función ( resp ) {
					alerta ( resp . msg );
				},
				Error :  la función ( e ) {
					alerta ( " Error al conectar Presentación: " + e . mensaje );
				}
			});
		}
		otra  alerta ( " Las claves no coinciden " );
	}
	otra  alerta ( " La Clave No Puede Estar en blanco " );
}

funcionar  modificarUsuario () {
	var FormData =  nueva  FormData ( $ ( " #formupdate " ) [ 0 ]);
	$ . Ajax ({
		Tipo :  ' palo ' ,
		url : waooserver + " / Usuarios / modificarUsuario " ,
		tipoDatos :  " json " ,
		datos : FormData,
		asíncrono :  falso ,
		caché :  falso ,
		contentType :  falso ,
		processData :  falso ,
		el éxito  :  la función ( resp ) {
			alerta ( resp . msg );
			colocarAvatar ( " # perfil-img " );
		},
		Error :  la función ( e ) {
			alerta ( " Error al conectar Presentación: " + e . mensaje );
		}
	});
}

función  colocarAvatar ( div ) {
	var apodo =  ventana . localStorage . getItem ( " nick " );
	$ . Ajax ({
		Tipo :  ' palo ' ,
		url : waooserver + " / Usuarios / verificaAvatar " ,
		tipoDatos :  " json " ,
		Datos : {nick : nick},
		el éxito  :  la función ( resp ) {
			var idimg =  resp . msg ;
			si (idimg * 1 == 0 ) $ . (div) prop ( " src " , " images / default_avatar.gif " );
			otra cosa  $ . (div) prop ( " src " , waooserver + " / Usuarios / verAvatar / " + idimg + " / " + (( Math . aleatoria () * 1000 ) / 1000 ));
		},
		Error :  la función ( e ) {
			alerta ( " Error al conectar Presentación: " + e . mensaje );
		}
	});
}

función  colocarAvatarOf ( div , apodo ) {
	$ . Ajax ({
		Tipo :  ' palo ' ,
		url : waooserver + " / Usuarios / verificaAvatar " ,
		tipoDatos :  " json " ,
		Datos : {nick : nick},
		el éxito  :  la función ( resp ) {
			var idimg =  resp . msg ;
			si (idimg * 1 == 0 ) $ . (div) prop ( " src " , " images / default_avatar.gif " );
			otra cosa  $ . (div) prop ( " src " , waooserver + " / Usuarios / verAvatar / " + idimg + " / " + (( Math . aleatoria () * 1000 ) / 1000 ));
		},
		Error :  la función ( e ) {
			alerta ( " Error al conectar Presentación: " + e . mensaje );
		}
	});
}

funcionar  actualizarCuenta () {
	var idbanco =  $ ( " opción #banct: seleccionado " ). val ();
	var numerocuenta =  $ . recortar ( $ ( " #numct " ). val ());
	var apodo =  ventana . localStorage . getItem ( " nick " );
	$ . Ajax ({
		Tipo :  ' palo ' ,
		url : waooserver + " / Usuarios / actualizarCuenta " ,
		tipoDatos :  " json " ,
		Datos : {nick : apodo, numerocuenta : numerocuenta, idbanco : idbanco},
		el éxito  :  la función ( resp ) {
			alerta ( resp . msg );
		},
		Error :  la función ( e ) {
			alerta ( " Error al conectar Presentación: " + e . mensaje );
		}
	});
}

funcionar  actualizarToken () {
	var contador =  ventana . localStorage . getItem ( " testigo " );
	var usuario =  ventana . localStorage . getItem ( " nick " );
	var plataforma =  ventana . localStorage . getItem ( " Plataforma " );

	si (Token ! =  nula ) {
		$ . Ajax ({
			Tipo :  ' palo ' ,
			url : waooserver + " / Usuarios / actualizarToken " ,
			tipoDatos :  " json " ,
			Datos : {contador : contador, apodo : usuario, Plataforma : Plataforma},
			el éxito  :  la función ( resp ) {},
			Error :  la función ( e ) {}
		});
	}
}
